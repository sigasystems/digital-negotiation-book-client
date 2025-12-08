import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buyerService } from "@/modules/buyer/service";
import { productService } from "@/modules/product/services";
import { offerService } from "@/modules/offers/services";
import { ArrowLeft, Save, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/common/ConfirmationModal";

// Import reusable components
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { EmptyState } from "./components/EmptyState";
import { OfferSummary } from "./components/OfferSummary";
import { VersionNavigation } from "./components/VersionNavigation";
import { NegotiationVersion } from "./components/NegotiationVersion";

const OfferNegotiation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loading: true,
    negotiations: [],
    rawOffer: null,
    error: "",
    saving: false,
    activeVersion: 0
  });

  const [productsList, setProductsList] = useState([]);
  const [speciesMap, setSpeciesMap] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // State updater helper
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadAllProducts = useCallback(async () => {
    try {
      const res = await productService.getAllProducts?.(0, 500);
      const list = res?.data?.data?.products || [];
      if (!mountedRef.current) return;

      setProductsList(list);

      const map = {};
      list.forEach((p) => {
        map[p.id] = p.species || [];
      });
      setSpeciesMap(map);
    } catch (err) {
      console.error("Failed to load products:", err);
      toast.error("Unable to load products");
    }
  }, []);

  useEffect(() => {
    loadAllProducts();
  }, [loadAllProducts]);

  const fetchProductDetails = useCallback(async (productId) => {
    if (!productId) return;
    try {
      const res = await productService.searchProducts?.({ productId }, 0, 50);
      const product = res?.data?.data?.products?.[0];

      if (mountedRef.current && product) {
        setSpeciesMap((prev) => ({
          ...prev,
          [productId]: product.species || [],
        }));
      }
    } catch (err) {
      console.error("Failed to fetch product details", err);
    }
  }, []);

  const findProductId = useCallback((productName) => {
      if (!productName) return "";
      const match = productsList.find(
        (p) => p.productName?.toLowerCase() === productName?.toLowerCase()
      );
      return match?.id || "";
    }, [productsList]);

  const normalizeNegotiations = useCallback((rows, productSection) => {
      const productMeta = productSection?.[0] || {};

      return rows.map((item) => {
        const inferred = findProductId(item.productName);

        const mergeSizes = Array.isArray(item.sizeBreakups)
          ? Object.values(
              item.sizeBreakups.reduce((acc, s) => {
                const key = `${s.size}-${s.breakup}-${s.price}-${s.condition}`;
                if (!acc[key]) acc[key] = { ...s };
                return acc;
              }, {})
            )
          : [];

        return {
          ...item,
          products: [
            {
              productId: productMeta.productId || item.productId || inferred || "",
              productName: productMeta.productName || item.productName || "",
              species: productMeta.species || item.speciesName || "",
              packing: productMeta.packing || "",
              sizeDetails: productMeta.sizeDetails || "",
              breakupDetails: productMeta.breakupDetails || "",
              priceDetails: productMeta.priceDetails || "",
              sizeBreakups: mergeSizes,
            },
          ],
        };
      });
  }, [findProductId]);

  const fetchLatestNegotiation = useCallback(async (signal) => {
      try {
        if (!id) {
        updateState({ error: "Invalid Offer ID", loading: false });
          return;
        }

        const res = await buyerService.latestNegotiation(id, { signal });
        const raw = res?.data?.data;

        if (!raw) {
        updateState({ negotiations: [], rawOffer: null, loading: false });
          return;
        }

      updateState({ rawOffer: raw.offer || null });

        const list = Array.isArray(raw.history) && raw.history.length > 0
            ? raw.history
            : raw.latestVersion ? [raw.latestVersion] : [];

        const normalized = normalizeNegotiations(list, raw.products || []);
        updateState({ negotiations: normalized, loading: false });
      } catch (err) {
        if (err?.name === "AbortError") return;

        toast.error("Failed to load negotiation history");
      updateState({ error: "Failed to load negotiation history", loading: false });
      }
    },
    [id, normalizeNegotiations, updateState]
  );

  useEffect(() => {
    if (!productsList.length) return;
    const controller = new AbortController();

    fetchLatestNegotiation(controller.signal);

    return () => controller.abort();
  }, [fetchLatestNegotiation, productsList.length]);

  const updateField = useCallback((negIndex, field, value) => {
    setState(prev => ({
      ...prev,
      negotiations: prev.negotiations.map((n, i) => 
        i === negIndex ? { ...n, [field]: value } : n
      )
    }));
  }, []);

  const makeSetFormDataForNegotiation = useCallback((negIndex) => (arg) => {
      setState(prev => {
        const copy = [...prev.negotiations];
        const current = copy[negIndex] || { products: [] };

        if (typeof arg === "function") {
          const updated = arg({ products: current.products }) || {};
          copy[negIndex] = {
            ...current,
            products: updated.products || current.products,
          };
        } else if (arg && Array.isArray(arg.products)) {
          copy[negIndex] = { ...current, products: arg.products };
        } else {
          return prev;
        }

        return { ...prev, negotiations: copy };
    });
    }, []);

  const handleProductSelectFactory = useCallback((negIndex) => async (pIndex, productId) => {
      setState(prev => {
        const copy = [...prev.negotiations];
        const n = copy[negIndex];
        if (!n) return prev;

        const productInfo = productsList.find((p) => p.id === productId);
        const prevProduct = n.products?.[pIndex] || {};

        const updatedProduct = {
          ...prevProduct,
          productId,
          productName: productInfo?.productName || prevProduct.productName || "",
          species: productInfo?.species?.[0] || prevProduct.species || "",
        };

        const updated = [...(n.products || [])];
        updated[pIndex] = updatedProduct;

        copy[negIndex] = { ...n, products: updated };

        return { ...prev, negotiations: copy };
      });

      if (!speciesMap[productId]) {
        await fetchProductDetails(productId);
      }
    },
    [productsList, speciesMap, fetchProductDetails]
  );

  const handleSaveClick = () => {
    if (!state.negotiations.length) {
      toast.error("No negotiation data to send.");
      return;
    }
    setIsConfirmOpen(true);
  };

  const confirmSave = useCallback(async () => {
    setIsConfirmOpen(false);
    
    if (state.saving || !state.negotiations.length) {
      return;
    }

    const latest = state.negotiations[state.negotiations.length - 1];
    updateState({ saving: true });

    try {
      const normalizedProducts = latest.products.map((p) => ({
        productId: p.productId || "",
        productName: p.productName || "",
        species: p.species || "",
        packing: p.packing || "",
        sizeDetails: p.sizeDetails || "",
        breakupDetails: p.breakupDetails || "",
        priceDetails: p.priceDetails || "",
        sizeBreakups: Array.isArray(p.sizeBreakups) ? p.sizeBreakups : [{ size: "", breakup: "", price: "", condition: "" }],
      }));

      const payload = {
        offerName: latest.offerName || state.rawOffer?.offerName || "",
        origin: latest.origin || state.rawOffer?.origin || "",
        destination: state.rawOffer?.destination || "",
        fromParty: latest.fromParty || "",
        toParty: latest.toParty || "",
        productName: latest.productName || "",
        speciesName: latest.speciesName || "",
        buyerId: state.rawOffer?.buyerId || latest.buyerId || "",
        brand: latest.brand || "",
        plantApprovalNumber: latest.plantApprovalNumber || "",
        quantity: latest.quantity || "",
        tolerance: latest.tolerance || "",
        paymentTerms: latest.paymentTerms || "",
        grandTotal: latest.grandTotal || "",
        remark: latest.remark || "",
        shipmentDate: latest.shipmentDate || "",
        products: normalizedProducts,
      };
      const res = await offerService.createOffer(id, payload);

      toast.success(res?.data?.message || "Offer created & sent successfully");
      setTimeout(() => navigate(-1), 700);
    } catch (err) {
      console.error("Failed to create offer:", err);
      toast.error(err?.response?.data?.message || "Failed to create offer");
    } finally {
      if (mountedRef.current) updateState({ saving: false });
    }
  }, [state, id, navigate, updateState]);

  const handleVersionChange = useCallback((index) => {
    updateState({ activeVersion: index });
  }, [updateState]);

  if (state.loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-slate-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin duration-700"></div>
      </div>
      <p className="text-slate-600 font-medium mt-3">Loading negotiation details...</p>
    </div>
  );
  
  if (state.error) return <ErrorState error={state.error} onBack={() => navigate(-1)} />;
  if (!state.negotiations.length) return <EmptyState onBack={() => navigate(-1)} />;

  return (
    <div className="relative min-h-screen bg-slate-50">
      {state.saving && (
         <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-slate-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin duration-700"></div>
      </div>
      <p className="text-slate-600 font-medium mt-3">Sending Offer...</p>
    </div>
      )}

      <header className="sticky top-17 bg-white border-b border-slate-200 shadow-sm z-20 rounded-lg mb-6 transition-all duration-200 mx-6">
        <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>

            <div className="flex items-center gap-3 ml-3">
                <div className="h-8 w-px bg-slate-200 hidden sm:block transition-all duration-300" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 transition-all duration-200">
                  Offer Negotiation
                </h1>
                <p className="text-sm text-slate-500 hidden sm:block mt-0.5 transition-all duration-200">
                  Manage and review negotiation versions
                </p>
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 text-sm font-normal transition-all duration-300"
          >
            {state.negotiations.length} Version{state.negotiations.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </header>

      <main className="px-[24.5px]">
        <OfferSummary offer={state.rawOffer} />
        
        <div className="mb-6">
        <VersionNavigation
          negotiations={state.negotiations}
          activeVersion={state.activeVersion}
          onVersionChange={handleVersionChange}
        />
        </div>

        <div className="space-y-6">
          {state.negotiations.map((item, negIndex) => (
            <NegotiationVersion
              key={item.id || negIndex}
              item={item}
              index={negIndex}
              isActive={state.activeVersion === negIndex}
              totalVersions={state.negotiations.length}
              onFieldUpdate={(field, value) => updateField(negIndex, field, value)}
              onProductSelect={handleProductSelectFactory(negIndex)}
                setFormData={makeSetFormDataForNegotiation(negIndex)}
                productsList={productsList}
                speciesMap={speciesMap}
              />
          ))}
        </div>

      <div className="sticky bottom-0 bg-white border-t border-slate-200 mt-10 py-4 px-4 shadow-lg z-30 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={state.saving}
              className="border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 cursor-pointer"
          >
              <X className="w-4 h-4 mr-2 transition-all duration-200" /> Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            disabled={state.saving || !state.negotiations.length}
              className="button-styling"
          >
            {state.saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin duration-700" /> Sending Offer...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 transition-all duration-200" /> Save & Send Offer
              </>
            )}
          </Button>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Send Offer"
        description="Are you sure you want to save and send this offer? This will create a new offer version."
        confirmText="Send Offer"
        cancelText="Cancel"
        confirmButtonColor="bg-[#16a34a] hover:bg-green-700"
      />
    </div>
  );
};

export default OfferNegotiation;
