import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, FilePlus2 } from "lucide-react";
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

  if (loading) return (<div className="min-h-screen flex items-center justify-center">Loading...</div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2 cursor-pointer" /> Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow cursor-pointer">
                <FilePlus2 className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Create Offer</h1>
                <p className="text-xs text-slate-500">From Draft #{formData.draftNo}</p>
              </div>
            </div>
          </div>

          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 cursor-pointer">
            Draft Loaded
          </Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        <div className="bg-white rounded-xl border border-slate-200 shadow p-6">
          <label className="text-sm font-medium text-slate-700">
            Offer Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter a unique offer name"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="mt-2 bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700">
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
            <SelectTrigger className="cursor-pointer mt-2 bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select To Party" />
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


      <div>
        <label className="text-sm font-medium text-slate-700">
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
        >
          <SelectTrigger className="cursor-pointer mt-2 bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Select Destination" />
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

        <div className="bg-white rounded-xl border border-slate-200 shadow p-6">
          <h2 className="font-semibold text-lg text-slate-800 mb-4">Basic Draft Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              ["draftNo", "Draft Number"],
              ["fromParty", "From Party"],
              ["origin", "Origin"],
              ["processor", "Processor"],
              ["plantApprovalNumber", "Plant Approval No"],
              ["brand", "Brand"],
              ["draftName", "Draft Name"],
              ["offerValidityDate", "Offer Validity"],
              ["shipmentDate", "Shipment Date"],
              ["grandTotal", "Grand Total"],
              ["quantity", "Quantity"],
              ["tolerance", "Tolerance"],
              ["paymentTerms", "Payment Terms"],
              ["remark", "Remark"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-sm font-medium text-slate-700">{label}</label>
                {key === "offerValidityDate" || key === "shipmentDate" ? (
                  <DatePicker
                    value={formData[key]}
                    onSelect={(d) => handleDateSelect(key, d)}
                    open={openPicker[key === "offerValidityDate" ? "validity" : "shipment"]}
                    setOpen={(v) => setOpenPicker((prev) => ({ ...prev, [key === "offerValidityDate" ? "validity" : "shipment"]:v, }))}
                  />
                ) : (
                <Input
                  value={formData[key] || ""}
                  disabled={["draftNo", "businessOwnerId", "fromParty", "processor", "brand"].includes(key)}
                  onChange={(e) => handleChange(key, e.target.value)}
                    className={`mt-1 ${["draftNo", "businessOwnerId", "fromParty", "processor", "brand"].includes(key) ? "bg-slate-100 cursor-not-allowed text-slate-600" : "bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"}`}
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

        <div className="sticky bottom-0 bg-white border-t border-slate-200 py-4 shadow-lg sm:shadow-none">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-end gap-3 px-4">
            <Button variant="outline" onClick={() => navigate(-1)} disabled={creating} className="w-full sm:w-auto cursor-pointer">
              Cancel
            </Button>

            <Button
              onClick={handleCreateOffer}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-pointer"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />Create Offer
                </>
              )}
            </Button>
          </div>
        </div>

      </main>

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmCreate}
        title="Create Offer"
        description="Are you sure you want to create this offer?"
        confirmText="Create Offer"
        cancelText="Cancel"
        confirmButtonColor="bg-blue-600 hover:bg-blue-700"
      />
    </div>
  );
};

export default CreateOffer;
