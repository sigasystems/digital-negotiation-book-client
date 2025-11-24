import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buyerService } from "@/modules/buyer/service";
import { productService } from "@/modules/product/services";
import { offerService } from "@/modules/offers/services";
import { Loader2, ArrowLeft, History, Save, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductSection from "@/modules/offerDraft/components/ProductSection";
import toast from "react-hot-toast";

const OfferNegotiation = () => {
  const { id } = useParams(); // this is used as draftId when creating an offer
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [negotiations, setNegotiations] = useState([]);
  const [error, setError] = useState("");

  const [productsList, setProductsList] = useState([]);
  const [speciesMap, setSpeciesMap] = useState({});

  const [saving, setSaving] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
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

  const findProductId = useCallback(
    (productName) => {
      if (!productName) return "";
      const match = productsList.find(
        (p) => p.productName?.toLowerCase() === productName?.toLowerCase()
      );
      return match?.id || "";
    },
    [productsList]
  );

  const normalizeNegotiations = useCallback(
    (rows) =>
      rows.map((item) => {
        const inferred = findProductId(item.productName);

        return {
          ...item,
          products: [
            {
              productId: item.productId || inferred || "",
              productName: item.productName || "",
              species: item.speciesName || "",
              packing: item.packing || item.brand || "",
              sizeDetails: item.sizeDetails || "",
              breakupDetails: item.breakupDetails || "",
              priceDetails: item.priceDetails || "",
              sizeBreakups: Array.isArray(item.sizeBreakups)
                ? item.sizeBreakups.map((s) => ({
                    size: s.size ?? "",
                    breakup: s.breakup ?? "",
                    price: s.price ?? "",
                    condition: s.condition ?? "",
                  }))
                : [{ size: "", breakup: "", price: "", condition: "" }],
            },
          ],
        };
      }),
    [findProductId]
  );

  const fetchLatestNegotiation = useCallback(
    async (signal) => {
      try {
        if (!id) {
          setError("Invalid Offer ID");
          setLoading(false);
          return;
        }

        const res = await buyerService.latestNegotiation(id, { signal });
        const list = res?.data?.data || [];

        const normalized = normalizeNegotiations(list);
        if (!mountedRef.current) return;

        setNegotiations(normalized);
      } catch (err) {
        if (err?.name === "AbortError") return;

        toast.error("Failed to load negotiation history");
        setError("Failed to load negotiation history");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [id, normalizeNegotiations]
  );

  useEffect(() => {
    if (!productsList.length) return;
    const controller = new AbortController();

    fetchLatestNegotiation(controller.signal);

    return () => controller.abort();
  }, [fetchLatestNegotiation, productsList.length]);

  const updateField = useCallback((negIndex, field, value) => {
    setNegotiations((prev) =>
      prev.map((n, i) => (i === negIndex ? { ...n, [field]: value } : n))
    );
  }, []);

  const makeSetFormDataForNegotiation = useCallback(
    (negIndex) => (arg) => {
      setNegotiations((prev) => {
        const copy = [...prev];
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

        return copy;
      });
    },
    []
  );

  const handleProductSelectFactory = useCallback(
    (negIndex) => async (pIndex, productId) => {
      setNegotiations((prev) => {
        const copy = [...prev];
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
        return copy;
      });

      if (!speciesMap[productId]) {
        await fetchProductDetails(productId);
      }
    },
    [productsList, speciesMap, fetchProductDetails]
  );

  // ---------------------------
  // handleSave -> createOffer
  // ---------------------------
  const handleSave = useCallback(async () => {
    if (saving) return;
    if (!negotiations.length) {
      toast.error("No negotiation data to send.");
      return;
    }

    setSaving(true);
    try {
      const latest = negotiations[negotiations.length - 1];

      if (!latest.fromParty?.toString().trim()) {
        toast.error("From Party is required");
        setSaving(false);
        return;
      }
      if (!latest.toParty?.toString().trim()) {
        toast.error("To Party is required");
        setSaving(false);
        return;
      }
      if (!Array.isArray(latest.products) || latest.products.length === 0) {
        toast.error("Product details missing");
        setSaving(false);
        return;
      }

      const normalizedProducts = latest.products.map((p) => ({
        productId: p.productId || "",
        productName: p.productName || "",
        species: p.species || "",
        packing: p.packing || p.packing || "",
        sizeDetails: p.sizeDetails || "",
        breakupDetails: p.breakupDetails || "",
        priceDetails: p.priceDetails || "",
        sizeBreakups: Array.isArray(p.sizeBreakups) ? p.sizeBreakups : [{ size: "", breakup: "", price: "", condition: "" }],
      }));

      const payload = {
        fromParty: latest.fromParty || "",
        toParty: latest.toParty || "",
        productName: latest.productName || "",
        speciesName: latest.speciesName || "",
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
      setTimeout(() => {
        navigate("/offers");
      }, 700);
    } catch (err) {
      console.error("Failed to create offer:", err);
      toast.error(err?.response?.data?.message || "Failed to create offer");
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  }, [negotiations, id, navigate, saving]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  if (!negotiations.length) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <History className="w-10 h-10 text-gray-500" />
        <p>No negotiation history found</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* HEADER — NO SAVE BUTTON */}
      <header className="sticky top-0 bg-white shadow p-4 flex justify-between items-center z-20">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        {negotiations.map((item, negIndex) => (
          <div
            key={item.id || negIndex}
            className="bg-white rounded-xl border shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between">
              <h2 className="font-bold flex items-center gap-2">
                <Package /> Version {item.versionNo}
              </h2>
              <span className="text-sm">{new Date(item.createdAt).toLocaleString()}</span>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "From Party", field: "fromParty" },
                  { label: "To Party", field: "toParty" },
                  { label: "Product Name", field: "productName" },
                  { label: "Species Name", field: "speciesName" },
                  { label: "Brand", field: "brand" },
                  { label: "Plant Approval", field: "plantApprovalNumber" },
                  { label: "Quantity", field: "quantity" },
                  { label: "Tolerance", field: "tolerance" },
                  { label: "Payment Terms", field: "paymentTerms" },
                ].map(({ label, field }) => (
                  <div key={field} className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600">{label}</label>
                    <input
                      value={item[field] ?? ""}
                      onChange={(e) => updateField(negIndex, field, e.target.value)}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-sm font-semibold text-gray-600">Grand Total</label>
                  <input
                    value={item.grandTotal ?? ""}
                    onChange={(e) => updateField(negIndex, "grandTotal", e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full bg-green-50 font-bold text-green-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Shipment Date</label>
                  <input
                    type="date"
                    value={(item.shipmentDate && item.shipmentDate.split?.("T")?.[0]) || ""}
                    onChange={(e) => updateField(negIndex, "shipmentDate", e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-sm font-semibold text-gray-600">Remark</label>
                  <textarea
                    rows={3}
                    value={item.remark ?? ""}
                    onChange={(e) => updateField(negIndex, "remark", e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              </div>

              <ProductSection
                productsData={item.products}
                setFormData={makeSetFormDataForNegotiation(negIndex)}
                productsList={productsList}
                speciesMap={speciesMap}
                onProductSelect={(pIndex, productId) => handleProductSelectFactory(negIndex)(pIndex, productId)}
              />
            </div>
          </div>
        ))}
      </main>

      {/* FOOTER — SAVE & SEND + CANCEL */}
      <footer className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 z-30">
        <div className="max-w-6xl mx-auto flex justify-end gap-4">
          <Button
            variant="ghost"
            className="border border-gray-300"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="bg-green-600 text-white shadow"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save & Send
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default OfferNegotiation;
