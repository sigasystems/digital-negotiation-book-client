import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { format, isBefore, startOfDay, parseISO } from "date-fns";
import { FileText, Sparkles } from "lucide-react";
import { offerDraftService } from "../services";
import { productService } from "@/modules/product/services";

import Header from "../components/Header";
import Section from "../components/Section";
import ReadOnlyField from "../components/ReadOnlyField";
import { InputField } from "@/components/common/InputField";
import DatePicker from "../components/DatePicker";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import { createHandleProductSelect } from "@/utils/getAllProducts";
import planUsageService from "@/services/planUsageService";

const EMPTY_PRODUCT = {
  productId: "",
  species: "",
  sizeBreakups: [{ size: "", breakup: "", price: "", condition: "" }],
  sizeDetails: "",
  breakupDetails: "",
  priceDetails: "",
  packing: "",
};

const CreateOfferDraft = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    const [remainingOffers, setRemainingOffers] = useState(0);
  
      // Fetch plan usage on mount
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
      }, [user.id]);
    

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
    [user]
  );

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState({ validity: false, shipment: false });

  const [productsList, setProductsList] = useState([]);
  const [speciesMap, setSpeciesMap] = useState({});

  const fetchProductDetails = async (productId) => {
    try {
      const res = await productService.searchProducts({ productId }, 0, 50);
      const product = res.data?.data?.products?.[0];

      if (product) {
        setSpeciesMap(prev => ({
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = createHandleProductSelect(setFormData, fetchProductDetails);

  const handleDateSelect = (key, date) => {
    if (!date) return;
    setFormData(prev => ({ ...prev, [key]: format(date, "yyyy-MM-dd") }));

    setOpenPicker(prev => ({
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
  const validityDate = formData.offerValidityDate ? parseISO(formData.offerValidityDate) : null;
  const shipmentDate = formData.shipmentDate ? parseISO(formData.shipmentDate) : null;

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
   products: formData.products.map(p => {
  const productInfo = productsList.find(x => x.id === p.productId);

  return {
    productId: p.productId,
    productName: productInfo?.productName || "",
    species: p.species,
    sizeDetails: p.sizeDetails || "",
    breakupDetails: p.breakupDetails || "",
    priceDetails: p.priceDetails || "",
    packing: p.packing || "",
    sizeBreakups: p.sizeBreakups.map(s => ({
      size: s.size,
      breakup: +s.breakup,
      condition: s.condition || "",
      price: +s.price,
    })),
  };
}),

  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const payload = formatPayload();
      const res = await offerDraftService.createDraft(payload);

      if (res?.status === 201 || res?.data?.success) {
        toast.success("Draft created successfully");
        setFormData(initialForm);
        window.location.reload()
      } else {
        toast.error("Failed to create draft");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating draft");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const loadAllProducts = async () => {
    try {
      const res = await productService.getAllProducts(0, 500);
      setProductsList(res.data?.data?.products || []);
    } catch (err) {
        console.error(err);
      toast.error("Unable to load products");
    }
  };

  loadAllProducts();

  const loadLatestDraftNo = async () => {
    try {
      const res = await offerDraftService.getLatestDraftNo();
      const lastDraftNo = res.data?.lastDraftNo || 0;
      setFormData(prev => ({
        ...prev,
        draftName: `Offer Draft ${lastDraftNo + 1}`,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch latest draft number");
    }
  };

  loadLatestDraftNo();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
        <Header onBack={() => (window.location.href = "/dashboard")} />

<<<<<<< Updated upstream

      <div>

        Remaining Credits For Create Offer : {remainingOffers}

      </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
=======
        <div className="mt-6 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <FileText size={32} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Offer Draft</h1>
                <Sparkles size={24} className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mt-1">Generate professional offer drafts for your clients</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
>>>>>>> Stashed changes
        >

             <Section title="Draft Details">
            <div className="grid sm:grid-cols-2 gap-6">
              <ReadOnlyField label="Draft Name" value={formData.draftName} />
              <InputField 
                required={true} 
                label="Quantity (MT)" 
                name="quantity" 
                value={formData.quantity} 
                onChange={handleChange} 
              />
              <InputField 
                required={true} 
                label="Tolerance (%)" 
                name="tolerance" 
                value={formData.tolerance} 
                onChange={handleChange} 
              />
              <InputField 
                required={true} 
                label="Payment Terms" 
                name="paymentTerms" 
                value={formData.paymentTerms} 
                onChange={handleChange} 
              />
              <InputField 
                required={true} 
                label="Remarks" 
                name="remark" 
                value={formData.remark} 
                onChange={handleChange} 
              />
              <InputField 
                required={true} 
                label="Grand Total (USD)" 
                name="grandTotal" 
                value={formData.grandTotal} 
                onChange={handleChange} 
              />
            </div>
          </Section>

          <Section title="Dates">
            <div className="grid sm:grid-cols-2 gap-6">
              <DatePicker 
                label="Offer Validity Date" 
                value={formData.offerValidityDate} 
                onSelect={(d) => handleDateSelect("offerValidityDate", d)} 
                open={openPicker.validity} 
                setOpen={(v) => setOpenPicker(prev => ({ ...prev, validity: v }))} 
              />
              <DatePicker 
                label="Shipment Date" 
                value={formData.shipmentDate} 
                onSelect={(d) => handleDateSelect("shipmentDate", d)} 
                open={openPicker.shipment} 
                setOpen={(v) => setOpenPicker(prev => ({ ...prev, shipment: v }))} 
              />
            </div>
          </Section>

          <Section title="Business Information">
            <div className="grid sm:grid-cols-2 gap-6">
              <ReadOnlyField label="From Party" value={formData.fromParty} />
              <InputField 
                required={true} 
                label="Origin" 
                name="origin" 
                value={formData.origin} 
                onChange={handleChange}
              />
              <InputField 
                required={true} 
                label="Processor" 
                name="processor" 
                value={formData.processor} 
                onChange={handleChange} 
              />
              <InputField 
                required={true} 
                label="Plant Approval Number" 
                name="plantApprovalNumber" 
                value={formData.plantApprovalNumber} 
                onChange={handleChange}
              />
              <InputField 
                required={true} 
                label="Brand" 
                name="brand" 
                value={formData.brand} 
                onChange={handleChange} 
              />
            </div>
          </Section>

          <Section title="Products & Size Details">
            <ProductSection
              productsData={formData.products || []}
              setFormData={setFormData}
              productsList={productsList}
              speciesMap={speciesMap}
              onProductSelect={handleProductSelect}
            />
          </Section>

          <Footer loading={loading} />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            All fields marked with an asterisk (*) are required. Please ensure all information is accurate before submitting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferDraft;
