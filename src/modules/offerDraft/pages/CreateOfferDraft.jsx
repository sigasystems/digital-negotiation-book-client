import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format, isBefore, startOfDay, parseISO } from "date-fns";
import { offerDraftService } from "../services";
import { productService } from "@/modules/product/services";
import { useToast } from "@/app/hooks/useToast";
import Section from "../components/Section";
import ReadOnlyField from "../components/ReadOnlyField";
import { InputField } from "@/components/common/InputField";
import DatePicker from "../components/DatePicker";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import { createHandleProductSelect } from "@/utils/getAllProducts";
import planUsageService from "@/services/planUsageService";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Toast } from "@/components/common/Toast";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";

const EMPTY_PRODUCT = {
  productId: "",
  species: "",
  sizeBreakups: [{ size: "", breakup: "", price: "", condition: "" }],
  sizeDetails: "Units / Remarks",
  breakupDetails: "Breakup Details",
  priceDetails: "$",
  packing: "",
};

const CreateOfferDraft = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { toasts, showToast } = useToast();
  const [remainingOffers, setRemainingOffers] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanUsage = async () => {
      try {
        await planUsageService.fetchUsage(user.id);
        const remaining = planUsageService.getRemainingCredits("offers");
        setRemainingOffers(remaining);
      } catch (err) {
        console.error("Failed to fetch plan usage:", err);
        showToast("error", "Failed to load plan info.");
      }
    };
    fetchPlanUsage();
  }, [user.id, showToast]);

  const initialForm = useMemo(
    () => ({
      businessOwnerId: user?.businessOwnerId || "",
      fromParty: user?.businessName || "",
      origin: "",
      processor: "",
      plantApprovalNumber: "",
      brand: "",
      offerValidityDate: "",
      shipmentDate: "",
      draftName: "",
      quantity: "",
      tolerance: "",
      paymentTerms: "",
      remark: "",
      grandTotal: "",
      products: [JSON.parse(JSON.stringify(EMPTY_PRODUCT))],
    }),
    [user][user],
  );

  const [formData, setFormData] = useState(initialForm);
  const [openPicker, setOpenPicker] = useState({
    validity: false,
    shipment: false,
  });
  const [productsList, setProductsList] = useState([]);
  const [speciesMap, setSpeciesMap] = useState({});

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
      toast.error("Unable to load product details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = createHandleProductSelect(
    setFormData,
    fetchProductDetails,
  );

  const handleDateSelect = (key, date) => {
    if (!date) return;
    setFormData((prev) => ({ ...prev, [key]: format(date, "yyyy-MM-dd") }));

    setOpenPicker((prev) => ({
      ...prev,
      [key === "offerValidityDate" ? "validity" : "shipment"]: false,
    }));
  };

  const validateForm = () => {
    const required = [
      "quantity",
      "tolerance",
      "paymentTerms",
      "remark",
      "grandTotal",
      "origin",
      "processor",
      "plantApprovalNumber",
      "brand",
    ];

    for (const f of required) {
      if (!formData[f]?.trim()) return `Please fill in all mandatory fields!`;
    }

    for (const [i, p] of formData.products.entries()) {
      if (!p.productId) return `Product #${i + 1}: Product is required`;
      if (!p.species) return `Product #${i + 1}: Species is required`;

      for (const [r, s] of p.sizeBreakups.entries()) {
        if (!s.size || !s.breakup || !s.price)
          return `Product #${i + 1}: Row ${r + 1} incomplete`;
      }
    }

    const today = startOfDay(new Date());
    const validityDate = formData.offerValidityDate
      ? parseISO(formData.offerValidityDate)
      : null;
    const shipmentDate = formData.shipmentDate
      ? parseISO(formData.shipmentDate)
      : null;

    if (validityDate && isBefore(validityDate, today)) {
      return "Offer Validity Date cannot be earlier than today";
    }

    if (shipmentDate && validityDate && isBefore(shipmentDate, validityDate)) {
      return "Shipment Date cannot be earlier than Offer Validity Date";
    }

    return null;
  };

  const formatPayload = () => ({
    ...formData,
    grandTotal: +formData.grandTotal,
    products: formData.products.map((p) => {
      const productInfo = productsList.find((x) => x.id === p.productId);

      return {
        productId: p.productId,
        productName: productInfo?.productName || "",
        species: p.species,
        sizeDetails: p.sizeDetails || "Units / Remarks",
        breakupDetails: p.breakupDetails || "Breakup Details",
        priceDetails: p.priceDetails || "$",
        packing: p.packing || "",
        sizeBreakups: p.sizeBreakups.map((s) => ({
          size: s.size,
          breakup: +s.breakup,
          condition: s.condition || "",
          price: +s.price,
        })),
      };
    }),
  });

  const submitDraft = async () => {
    setLoading(true);
    try {
      const payload = formatPayload();
      const res = await offerDraftService.createDraft(payload);

      if (res?.status === 201 || res?.data?.success) {
        showToast("success", "Draft created successfully");
        setFormData(initialForm);
        navigate("/offer-draft");
      } else {
        showToast("error", "Failed to create draft");
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Error creating draft",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return showToast("error", error);
    setIsConfirmOpen(true);
  };

  const confirmCreate = async () => {
    setIsConfirmOpen(false);
    await submitDraft();
  };

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const res = await productService.getAllProducts(0, 500);
        setProductsList(res.data?.data?.products || []);
      } catch (err) {
        console.error(err);
        showToast("error", "Unable to load products");
      }
    };

    loadAllProducts();

    const loadLatestDraftNo = async () => {
      try {
        const res = await offerDraftService.getLatestDraftNo();
        const lastDraftNo = res.data?.lastDraftNo || 0;
        setFormData((prev) => ({
          ...prev,
          draftName: `Offer Draft ${lastDraftNo + 1}`,
        }));
      } catch (err) {
        console.error(err);
        showToast("error", "Unable to fetch latest draft number");
      }
    };

    loadLatestDraftNo();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 px-[24.5px]">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Creating draft...</p>
        </div>
      )}

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>

      <header className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-20 rounded-xl">
        <div className="mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex items-center text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-3 ml-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Create Offer Draft
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Generate professional offer drafts
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 space-y-6">
            {/* Remaining Credits */}
            <div className="flex items-center gap-2 px-9 pt-4 font-bold">
              {remainingOffers > 0 ? (
                <>
                  <span className="text-[#16a34a] text-lg">
                    Remaining Credits:
                  </span>

                  <span className="text-[#16a34a] text-lg">
                    {remainingOffers}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#16a34a] text-lg">
                    Remaining Credits:
                  </span>
                  <span className="text-red-700 text-lg">
                    Plan limit for adding offers is exceeded...
                  </span>
                </>
              )}
            </div>

            <form onSubmit={handleCreateClick}>
              {/* Draft Details Section */}
              <div className="border border-slate-200 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-slate-900 mb-6">
                  Draft Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Draft Name
                    </label>
                    <input
                      type="text"
                      value={formData.draftName}
                      readOnly
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Quantity (MT) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      placeholder="25"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Tolerance (%) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tolerance"
                      value={formData.tolerance}
                      placeholder="+/- 10"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Payment Terms <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      placeholder="LC at sight, 30% advance"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Remarks <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="remark"
                      value={formData.remark}
                      placeholder="Optional notes or conditions"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Grand Total (USD) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="grandTotal"
                      value={formData.grandTotal}
                      placeholder="12500"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Dates Section */}
              <div className="border border-slate-200 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-slate-900 mb-6">Dates</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <DatePicker
                      label="Offer Validity Date"
                      value={formData.offerValidityDate}
                      placeholder="Select validity date"
                      onSelect={(d) => handleDateSelect("offerValidityDate", d)}
                      open={openPicker.validity}
                      setOpen={(v) =>
                        setOpenPicker((prev) => ({ ...prev, validity: v }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <DatePicker
                      label="Shipment Date"
                      value={formData.shipmentDate}
                      placeholder="Select shipment date"
                      onSelect={(d) => handleDateSelect("shipmentDate", d)}
                      open={openPicker.shipment}
                      setOpen={(v) =>
                        setOpenPicker((prev) => ({ ...prev, shipment: v }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div className="border border-slate-200 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-slate-900 mb-6">
                  Business Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      From Party
                    </label>
                    <input
                      type="text"
                      value={formData.fromParty}
                      readOnly
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Origin <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      placeholder="Brazil"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Processor <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="processor"
                      value={formData.processor}
                      placeholder="Company or facility name"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Plant Approval Number{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="plantApprovalNumber"
                      value={formData.plantApprovalNumber}
                      placeholder="ABC-12345"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Brand <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      placeholder="Product brand name"
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Products & Size Details Section */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h2 className="font-semibold text-slate-900 mb-6">
                  Products & Size Details
                </h2>
                <ProductSection
                  productsData={formData.products || []}
                  setFormData={setFormData}
                  productsList={productsList}
                  speciesMap={speciesMap}
                  onProductSelect={handleProductSelect}
                />
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => navigate(-1)}
              disabled={loading}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>

            <button
              onClick={handleCreateClick}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 button-styling"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Creating...
                </>
              ) : (
                <>Create Draft</>
              )}
            </button>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmCreate}
        title="Confirm Offer Draft Creation"
        description="Are you sure you want to create this offer draft? This will save the draft with the details you've entered."
        confirmText="Create Draft"
        cancelText="Cancel"
        confirmButtonColor="bg-indigo-600 hover:bg-indigo-700"
      />
    </div>
  );
};

export default CreateOfferDraft;
