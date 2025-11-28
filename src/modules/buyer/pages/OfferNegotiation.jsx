import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buyerService } from "@/modules/buyer/service";
import { productService } from "@/modules/product/services";
import { offerService } from "@/modules/offers/services";
import { Loader2, ArrowLeft, History, Save, Package, FileText, Users, MapPin, Calendar, DollarSign, Tag, Building, Truck} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductSection from "@/modules/offerDraft/components/ProductSection";
import toast from "react-hot-toast";

const OfferNegotiation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [negotiations, setNegotiations] = useState([]);
  const [rawOffer, setRawOffer] = useState(null);
  const [error, setError] = useState("");

  const [productsList, setProductsList] = useState([]);
  const [speciesMap, setSpeciesMap] = useState({});

  const [saving, setSaving] = useState(false);
  const [activeVersion, setActiveVersion] = useState(0);

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
    (rows, productSection) => {
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
              productId:
                productMeta.productId || item.productId || inferred || "",
              productName:
                productMeta.productName || item.productName || "",
              species:
                productMeta.species || item.speciesName || "",
              packing: productMeta.packing || "",
              sizeDetails: productMeta.sizeDetails || "",
              breakupDetails: productMeta.breakupDetails || "",
              priceDetails: productMeta.priceDetails || "",
              sizeBreakups: mergeSizes,
            },
          ],
        };
      })},
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
        const raw = res?.data?.data;

        if (!raw) {
          setNegotiations([]);
          setRawOffer(null);
          return;
        }

        setRawOffer(raw.offer || null);

        const list =
          Array.isArray(raw.history) && raw.history.length > 0
            ? raw.history
            : raw.latestVersion
            ? [raw.latestVersion]
            : [];

        const normalized = normalizeNegotiations(list, raw.products || []);

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

  const handleSave = useCallback(async () => {
    if (saving) return;
    if (!negotiations.length) {
      toast.error("No negotiation data to send.");
      return;
    }

    const latest = negotiations[negotiations.length - 1];

    setSaving(true);
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
        offerName: latest.offerName || rawOffer?.offerName || "",
        origin: latest.origin || rawOffer?.origin || "",
        destination: rawOffer?.destination || "",
        fromParty: latest.fromParty || "",
        toParty: latest.toParty || "",
        productName: latest.productName || "",
        speciesName: latest.speciesName || "",
        buyerId: rawOffer?.buyerId || latest.buyerId || "",
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
      if (mountedRef.current) setSaving(false);
    }
  }, [negotiations, id, saving, navigate, rawOffer]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-medium">Loading negotiation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
          <ArrowLeft className="w-4 h-4" /> Back to Previous
        </Button>
        </div>
      </div>
    );
  }

  if (!negotiations.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No Negotiation History</h3>
          <p className="text-slate-600 mb-6">No negotiation data available for this offer.</p>
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Offers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-24">
      <header className="sticky top-15 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm z-40 mb-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Offer Negotiation</h1>
                <p className="text-sm text-slate-500">Manage and review negotiation versions</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              {negotiations.length} Version{negotiations.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {rawOffer && (
          <Card className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Building className="w-5 h-5 text-blue-600" />
                Offer Summary
              </CardTitle>
              <CardDescription>Original offer details and specifications</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Tag className="w-4 h-4" />
                    Offer Name
                  </div>
                  <p className="text-sm text-slate-900 font-semibold">{rawOffer.offerName}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Users className="w-4 h-4" />
                    From Party
                  </div>
                  <p className="text-sm text-slate-900">{rawOffer.fromParty}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Users className="w-4 h-4" />
                    To Party
                  </div>
                  <p className="text-sm text-slate-900">{rawOffer.toParty}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    Grand Total
                  </div>
                  <p className="text-sm text-slate-900 font-semibold text-green-600">{rawOffer.grandTotal}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <MapPin className="w-4 h-4" />
                    Origin & Destination
                  </div>
                  <p className="text-sm text-slate-900">{rawOffer.origin} → {rawOffer.destination}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Calendar className="w-4 h-4" />
                    Validity Date
                  </div>
                  <p className="text-sm text-slate-900">{rawOffer.offerValidityDate?.split("T")[0] || '-'}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Truck className="w-4 h-4" />
                    Shipment Date
                  </div>
                  <p className="text-sm text-slate-900">{rawOffer.shipmentDate?.split("T")[0] || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Version Navigation */}
        {negotiations.length > 1 && (
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Navigate Versions</span>
                </div>
                <div className="flex gap-2">
                  {negotiations.map((_, index) => (
                    <Button
                      key={index}
                      variant={activeVersion === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveVersion(index)}
                      className={activeVersion === index ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      V{index + 1}
                    </Button>
            ))}
          </div>
        </div>
            </CardContent>
          </Card>
      )}

      <div className="space-y-6">
        {negotiations.map((item, negIndex) => (
          <Card 
            key={item.id || negIndex} 
              className={`shadow-lg border-2 transition-all duration-300 ${
                activeVersion === negIndex 
                  ? "border-blue-500 ring-2 ring-blue-100" 
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-slate-800">
                        Version {item.versionNo}
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {negIndex === negotiations.length - 1 ? 'Latest' : 'Historical'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Created {new Date(item.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {item.grandTotal}
                    </div>
                    <div className="text-sm text-slate-500">Grand Total</div>
                  </div>
            </div>
              </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "From Party", field: "fromParty", icon: Users },
                  { label: "To Party", field: "toParty", icon: Users },
                  { label: "Product Name", field: "productName", icon: Package },
                  { label: "Species Name", field: "speciesName", icon: Tag },
                  { label: "Brand", field: "brand", icon: Building },
                  { label: "Plant Approval", field: "plantApprovalNumber", icon: Building },
                  { label: "Quantity", field: "quantity", icon: Package },
                  { label: "Tolerance", field: "tolerance", icon: Tag },
                  { label: "Payment Terms", field: "paymentTerms", icon: DollarSign },
                ].map(({ label, field, icon: Icon }) => (
                  <div key={field} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Icon className="w-4 h-4 text-slate-500" />{label}
                      </label>
                    <input
                      value={item[field] ?? ""}
                      onChange={(e) => updateField(negIndex, field, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      Grand Total
                    </label>
                  <input
                    value={item.grandTotal ?? ""}
                    onChange={(e) => updateField(negIndex, "grandTotal", e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-green-50 font-bold text-green-700"
                      placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Shipment Date
                    </label>
                  <input
                    type="date"
                    value={(item.shipmentDate && item.shipmentDate.split?.("T")?.[0]) || ""}
                    onChange={(e) => updateField(negIndex, "shipmentDate", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Remark
                  </label>
                  <textarea
                    rows={3}
                    value={item.remark ?? ""}
                    onChange={(e) => updateField(negIndex, "remark", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
                    placeholder="Add any additional remarks or notes..."
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Product Details</h3>
              </div>
              <ProductSection
                productsData={item.products}
                setFormData={makeSetFormDataForNegotiation(negIndex)}
                productsList={productsList}
                speciesMap={speciesMap}
                onProductSelect={(pIndex, productId) =>
                      handleProductSelectFactory(negIndex)(pIndex, productId)
                    }
              />
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={saving}
              className="w-full sm:w-auto cursor-pointer border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Offer...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save & Send Offer
              </>
            )}
          </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OfferNegotiation;
