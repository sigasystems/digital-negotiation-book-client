import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Building2, 
  Calendar, 
  Package, 
  Loader2,
  FilePlus2,
  CheckCircle2,
  X
} from "lucide-react";
import { offerDraftService } from "../services";
import { productService } from "@/modules/product/services";
import { createHandleProductSelect } from "@/utils/getAllProducts";
import { validateOfferDates } from "@/utils/formateDate";
import { InputField } from "@/components/common/InputField";
import ReadOnlyField from "../components/ReadOnlyField";
import ProductSection from "../components/ProductSection";
import DatePicker from "../components/DatePicker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const ViewOfferDraft = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [productsList, setProductsList] = useState([]);
  const [speciesMap, setSpeciesMap] = useState({});
  const [openPicker, setOpenPicker] = useState({
    validity: false,
    shipment: false,
  });

  useEffect(() => {
  const fetchDraft = async () => {
    try {
      const res = await offerDraftService.getDraftById(id);
      const draft = res?.data?.data?.draft;
      if (!draft) return toast.error("Draft not found");

      const normalizedProducts = (draft.draftProducts || []).map((p) => ({
          productId: p.productId,
          productName: p.productName,
          species: p.species,
          sizeDetails: p.sizeDetails || "",
          breakupDetails: p.breakupDetails || "",
          priceDetails: p.priceDetails || "",
          packing: p.packing || "",
          sizeBreakups: (p.sizeBreakups || []).map((sb) => ({
            size: sb.size,
            breakup: sb.breakup,
            price: sb.price,
            condition: sb.condition || "",
            sizeDetails: sb.sizeDetails || "",
            breakupDetails: sb.breakupDetails || "",
            priceDetails: sb.priceDetails || "",
          })),
        }));

        const normalized = {
          ...draft,
          products: normalizedProducts,
      };

      setFormData(normalized);
      setOriginalData(JSON.parse(JSON.stringify(normalized)));

      draft.draftProducts?.forEach(async (p) => {
        if (!p.productId) return;

        const res = await productService.searchProducts({ productId: p.productId }, 0, 50);
        const product = res.data?.data?.products?.[0];
        if (product) {
          let speciesArr = product.species || [];
          if (p.species && !speciesArr.includes(p.species)) {
            speciesArr = [p.species, ...speciesArr];
          }
          setSpeciesMap((prev) => ({ ...prev, [p.productId]: speciesArr }));
        }
      });

    } catch (err) {
        console.error("Draft load error:", err);
      toast.error("Failed to load draft");
    } finally {
      setLoading(false);
    }
  };
  fetchDraft();
}, [id]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productService.getAllProducts(0, 500);
        setProductsList(res.data?.data?.products || []);
      } catch {
        toast.error("Unable to load product list");
      }
    };
    loadProducts();
  }, []);

  const fetchProductDetails = async (productId) => {
    try {
      const res = await productService.searchProducts({ productId }, 0, 50);
      const product = res.data?.data?.products?.[0];
      if (product) {
        setSpeciesMap((prev) => ({
          ...prev,
          [productId]: product.species || [],
        }));
      }
    } catch {
      toast.error("Failed to load species");
    }
  };

  const handleProductSelect = createHandleProductSelect(setFormData, fetchProductDetails);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (key, date) => {
    if (!date) return;

    const iso = new Date(date).toISOString();

    setFormData((prev) => ({ ...prev, [key]: iso }));
  };

  const handleSave = async () => {
    const validation = validateOfferDates(
      formData.offerValidityDate,
      formData.shipmentDate
    );

    if (validation) return toast.error(validation);

    setSaving(true);
    try {
      const res = await offerDraftService.updateDraft(id, formData);

      if (!res?.data?.success) {
        toast.error("Failed to update");
        return;
      }

      toast.success("Updated successfully");
      setOriginalData(JSON.parse(JSON.stringify(formData)));
    } catch {
      toast.error("Error updating draft");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (!isChanged) return;
    
    const validation = validateOfferDates(
      formData.offerValidityDate,
      formData.shipmentDate
    );

    if (validation) {
      toast.error(validation);
      return;
    }
    
    setIsConfirmOpen(true);
  };

  const confirmSave = async () => {
    setIsConfirmOpen(false);
    await handleSave();
  };

  const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

  if (loading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-medium text-base sm:text-lg">Loading draft details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8 px-[24.5px]">
      {saving && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-slate-700 font-medium">Saving changes...</p>
        </div>
      )}

      <header className="sticky top-17 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm z-20 rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
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
              <div className="h-8 w-px bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">View Draft</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isChanged && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 px-3 py-1.5 text-xs sm:text-sm font-medium animate-pulse">
                  Unsaved Changes
                </Badge>
              )}
              <Button
                onClick={() =>
                  navigate(`/offer/${formData.draftNo}`, {
                    state: { draftId: id },
                  })
                }
                className="button-styling"
              >
                Create Offer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-8">      
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <h2 className="font-semibold text-base sm:text-lg text-slate-900">Business Information</h2>
            </div>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <ReadOnlyField label="Draft Number" value={formData.draftNo} />
              <InputField 
                label="From Party" 
                name="fromParty" 
                value={formData.fromParty} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Origin" 
                name="origin" 
                value={formData.origin} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Processor" 
                name="processor" 
                value={formData.processor} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Plant Approval Number" 
                name="plantApprovalNumber" 
                value={formData.plantApprovalNumber} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Brand" 
                name="brand" 
                value={formData.brand} 
                onChange={handleChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Draft Details Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <h2 className="font-semibold text-base sm:text-lg text-slate-900">Draft Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <InputField 
                label="Draft Name" 
                name="draftName" 
                value={formData.draftName} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Quantity" 
                name="quantity" 
                value={formData.quantity} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Tolerance" 
                name="tolerance" 
                value={formData.tolerance} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Payment Terms" 
                name="paymentTerms" 
                value={formData.paymentTerms} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Remark" 
                name="remark" 
                value={formData.remark} 
                onChange={handleChange}
                className="cursor-pointer"
              />
              <InputField 
                label="Grand Total" 
                name="grandTotal" 
                value={formData.grandTotal} 
                onChange={handleChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <h2 className="font-semibold text-base sm:text-lg text-slate-900">Important Dates</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <DatePicker 
                  label="Offer Validity Date" 
                  value={formData.offerValidityDate} 
                  onSelect={(d) => handleDateSelect("offerValidityDate", d)} 
                  open={openPicker.validity} 
                  setOpen={(v) => setOpenPicker((p) => ({ ...p, validity: v }))}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <DatePicker 
                  label="Shipment Date" 
                  value={formData.shipmentDate} 
                  onSelect={(d) => handleDateSelect("shipmentDate", d)} 
                  open={openPicker.shipment} 
                  setOpen={(v) => setOpenPicker((p) => ({ ...p, shipment: v }))}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <h2 className="font-semibold text-base sm:text-lg text-slate-900">Product & Size Details</h2>
            </div>

            <ProductSection
              productsData={formData.products}
              setFormData={setFormData}
              productsList={productsList}
              speciesMap={speciesMap}
              onProductSelect={handleProductSelect}
            />
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-sm z-20 mt-10 rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {isChanged ? (
                <div className="flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                  <span className="font-medium">You have unsaved changes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">All changes saved</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)} 
                disabled={saving}
                className="cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>

              <Button
                onClick={handleSaveClick}
                disabled={saving || !isChanged}
                className="button-styling"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Confirm Update"
        description="Are you sure you want to save these changes? This will update the draft with the new information."
        confirmText="Save Changes"
        cancelText="Cancel"
        confirmButtonColor="bg-[#16a34a] hover:bg-green-700"
      />
    </div>
  );
};

export default ViewOfferDraft;