import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, FilePlus2, Package, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import ProductSection from "@/modules/offerDraft/components/ProductSection";
import DatePicker from "@/modules/offerDraft/components/DatePicker";
import { offerDraftService } from "@/modules/offerDraft/services";
import { productService } from "@/modules/product/services";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { createHandleProductSelect } from "@/utils/getAllProducts";
import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { offerService } from "../services";
import { locationServices } from "@/modules/location/service";

const EMPTY_PRODUCT = {
  productId: "",
  species: "",
  sizeBreakups: [{ size: "", breakup: "", price: "", condition: "" }],
};

const CreateOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const draftId = location.state?.draftId || params.id;

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const initialForm = useMemo(() => ({
    businessOwnerId: user?.businessOwnerId || "",
    fromParty: user?.businessName || "",
    buyerId: "",
    toParty: "",
    origin: "",
    processor: "",
    plantApprovalNumber: "",
    brand: "",
    offerValidityDate: "",
    shipmentDate: "",
    packing: "",
    draftName: "",
    quantity: "",
    tolerance: "",
    paymentTerms: "",
    remark: "",
    grandTotal: "",
    destination: "",
    products: [JSON.parse(JSON.stringify(EMPTY_PRODUCT))],
  }), [user]);

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openPicker, setOpenPicker] = useState({ validity: false, shipment: false });
  const [productsList, setProductsList] = useState([]);
  const [speciesMap, setSpeciesMap] = useState({});
  const [offerName, setOfferName] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchProductDetails = async (productId) => {
    try {
      const res = await productService.searchProducts({ productId }, 0, 50);
      const product = res.data?.data?.products?.[0];
      if (product) {
        setSpeciesMap((prev) => ({ ...prev, [productId]: product.species || [] }));
      }
    } catch {
      toast.error("Unable to load product details");
    }
  };

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleProductSelect = createHandleProductSelect(setFormData, fetchProductDetails);

  const handleDateSelect = (key, date) => {
    if (!date) return;
    setFormData((prev) => ({ ...prev, [key]: date }));
    setOpenPicker((prev) => ({
      ...prev,
      [key === "offerValidityDate" ? "validity" : "shipment"]: false,
    }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, JSON.parse(JSON.stringify(EMPTY_PRODUCT))],
    }));
  };

  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const loadNextOfferName = async () => {
  try {
    const res = await offerService.getOfferName();
    const name = res?.data?.data?.offerName;
    if (name) setOfferName(name);
  } catch {
    toast.error("Unable to load next offer name");
  }
};


  useEffect(() => {
    const loadDraft = async () => {
      if (!draftId) return;
      try {
        const res = await offerDraftService.getDraftById(draftId);
        const data = res?.data?.data?.draft;

        if (data) {
          const mappedProducts = (data.draftProducts || []).map((p) => ({
            productId: p.productId,
            species: p.species,
            packing: p.packing,
            priceDetails: p.priceDetails,
            productName: p.productName,
            breakupDetails: p.breakupDetails,
            sizeDetails: p.sizeDetails,
            sizeBreakups: (p.sizeBreakups || []).map((sb) => ({
              size: sb.size,
              breakup: sb.breakup,
              price: sb.price,
              condition: sb.condition || "",
            })),
          }));

          setFormData((prev) => ({
          ...prev,
          ...data,
            products: mappedProducts.length ? mappedProducts : [JSON.parse(JSON.stringify(EMPTY_PRODUCT))],
        }));
          setOfferName(`Offer ${data.draftNo}`);
        }
      } catch {
        toast.error("Failed to load draft details.");
      } finally {
        setLoading(false);
      }
    };

    const loadProducts = async () => {
      try {
        const res = await productService.getAllProducts(0, 500);
        setProductsList(res.data?.data?.products || []);
      } catch {
        toast.error("Unable to load products");
      }
    };

    const loadBuyers = async () => {
      try {
        const res = await businessOwnerService.getBuyersList();
        setBuyers(res.data?.data || []);
      } catch {
        toast.error("Unable to load buyers");
      }
    };

    const loadLocations = async () => {
      try {
        const res = await locationServices.getAllLocations();
        setLocations(res.data?.data?.locations || []);
      } catch {
        toast.error("Unable to load locations");
      }
    };

    loadDraft();
    loadProducts();
    loadBuyers();
    loadLocations();
    loadNextOfferName();
  }, [draftId]);

  const handleCreateOffer = () => {
    if (!offerName.trim()) return toast.error("Offer name is required");
    if (!formData.buyerId) return toast.error("Please select a to party!");
    setConfirmOpen(true);
  };

  const confirmCreate = async () => {
    setConfirmOpen(false);
    setCreating(true);
    try {
      const payload = { ...formData, offerName };
      const res = await offerService.createOffer(draftId, payload);
      const msg = res?.data?.message || "Offer created successfully";
      toast.success(msg);
      setTimeout(() => navigate("/offers"), 800);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create offer");
    } finally {
      setCreating(false);
    }
  };

  if (loading){ return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-medium">Loading offer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-24 lg:pb-8">

      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)} 
                className="cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <FilePlus2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Create Offer</h1>
                <p className="text-xs sm:text-sm text-slate-500">From Draft #{formData.draftNo}</p>
                </div>
              </div>
            </div>

            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 px-3 py-1.5 text-xs sm:text-sm font-medium w-fit">
              Draft Loaded
            </Badge>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm sm:text-base font-semibold text-slate-900 block">
            Offer Name <span className="text-red-500">*</span>
          </label>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Enter a unique identifier for this offer</p>
            </div>
          </div>
          <Input
            placeholder="e.g., Offer-2024-001"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="mt-3 bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 border-slate-300 transition-all text-sm sm:text-base h-11 sm:h-12"
          />
        </div>

        {/* Party & Destination Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-8">
          <h2 className="font-semibold text-base sm:text-lg text-slate-900 mb-5 sm:mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Party & Destination Details
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* To Party */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-slate-700 block">
            To Party <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(val) => {
              const buyer = buyers.find((b) => b.id === val);
              setFormData((prev) => ({
                ...prev,
                buyerId: val,
                toParty: buyer?.buyersCompanyName || "",
              }));
            }}
            value={formData.buyerId || ""}
          >
            <SelectTrigger className="cursor-pointer bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500 border-slate-300 transition-all h-11 sm:h-12 text-sm sm:text-base">
              <SelectValue placeholder="Select buyer company" />
            </SelectTrigger>
            <SelectContent>
              {buyers.length > 0 ? (
                buyers.map((buyer) => (
                  <SelectItem key={buyer.id} value={buyer.id} className="cursor-pointer">
                    {buyer.buyersCompanyName}
                  </SelectItem>
                ))
              ) : (
                <div className="px-3 py-2 text-slate-500 text-sm">
                  No buyers found
                </div>
              )}
            </SelectContent>
          </Select>
        </div>


      <div className="space-y-2">
        <label className="text-sm sm:text-base font-medium text-slate-700 block">
          Destination <span className="text-red-500">*</span>
        </label>

        <Select
          onValueChange={(val) => {
            const loc = locations.find((l) => l.id === val);
            setFormData((prev) => ({
              ...prev,
              destination: `${loc.city}, ${loc.state}, ${loc.country?.name}`,
            }));
          }}
                value={formData.destination ? locations.find(l => formData.destination.includes(l.city))?.id : ""}
        >
          <SelectTrigger className="cursor-pointer bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500 border-slate-300 transition-all h-11 sm:h-12 text-sm sm:text-base">
            <SelectValue placeholder="Select destination location" />
          </SelectTrigger>

          <SelectContent>
            {locations.length > 0 ? (
              locations.map((loc) => (
                <SelectItem
                  key={loc.id}
                  value={loc.id}
                  className="cursor-pointer"
                >
                  {`${loc.city}, ${loc.state}, ${loc.country?.name}`}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-slate-500 text-sm">
                No locations found
              </div>
            )}
          </SelectContent>
        </Select>
      </div>


        </div>
      </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-8">
          <h2 className="font-semibold text-base sm:text-lg text-slate-900 mb-5 sm:mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Draft Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              ["draftNo", "Draft Number", true],
              ["fromParty", "From Party", true],
              ["origin", "Origin", false],
              ["processor", "Processor", true],
              ["plantApprovalNumber", "Plant Approval No", false],
              ["brand", "Brand", true],
              ["draftName", "Draft Name", true],
              ["offerValidityDate", "Offer Validity", false],
              ["shipmentDate", "Shipment Date", false],
              ["grandTotal", "Grand Total", false],
              ["quantity", "Quantity", false],
              ["tolerance", "Tolerance", false],
              ["paymentTerms", "Payment Terms", false],
              ["remark", "Remark", false],
            ].map(([key, label, isDisabled]) => (
              <div key={key} className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-700 block">{label}</label>
                {key === "offerValidityDate" || key === "shipmentDate" ? (
                  <DatePicker
                    value={formData[key]}
                    onSelect={(d) => handleDateSelect(key, d)}
                    open={openPicker[key === "offerValidityDate" ? "validity" : "shipment"]}
                    setOpen={(v) => setOpenPicker((prev) => ({ 
                       ...prev, 
                      [key === "offerValidityDate" ? "validity" : "shipment"]: v 
                    }))}
                  />
                ) : (
                <Input
                  value={formData[key] || ""}
                  disabled={isDisabled}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={`text-sm sm:text-base h-10 sm:h-11 transition-all ${
                    isDisabled
                      ? "bg-slate-100 cursor-not-allowed text-slate-600 border-slate-200"
                      : "bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 border-slate-300 cursor-text"
                  }`}
                />
                )}
              </div>
            ))}
          </div>
        </div>

       <ProductSection
          productsData={formData.products}
          setFormData={setFormData}
          productsList={productsList}
          speciesMap={speciesMap}
          onProductSelect={handleProductSelect}
          readOnly={false}
          addProduct={addProduct}
          removeProduct={removeProduct}
      />
      </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-2xl z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              disabled={creating} 
              className="w-full sm:w-auto cursor-pointer hover:bg-slate-100 border-slate-300 transition-colors h-11 sm:h-12 text-sm sm:text-base font-medium"
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreateOffer}
              disabled={creating}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer shadow-lg hover:shadow-xl transition-all h-11 sm:h-12 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />Creating Offer...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />Create Offer
                </>
              )}
            </Button>
          </div>
        </div>

      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmCreate}
        title="Create Offer"
        description="Are you sure you want to create this offer? This action will generate a new offer based on the draft details."
        confirmText="Create Offer"
        cancelText="Cancel"
        confirmButtonColor="bg-blue-600 hover:bg-blue-700"
      />
    </div>
  );
};

export default CreateOffer;
