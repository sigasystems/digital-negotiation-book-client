import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { format, isBefore, startOfDay, parseISO } from "date-fns";
import { offerDraftService } from "../services";
import { productService } from "@/modules/product/services";

import Header from "../components/Header";
import Section from "../components/Section";
import ReadOnlyField from "../components/ReadOnlyField";
import { InputField } from "@/components/common/InputField";
import DatePicker from "../components/DatePicker";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";

const EMPTY_PRODUCT = {
  productId: "",
  species: "",
  sizeBreakups: [{ size: "", breakup: "", price: "", condition: "" }],
};

const CreateOfferDraft = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

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
      packing: "",
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

  const handleProductSelect = async (pIndex, productId) => {
    setFormData(prev => {
      const copy = [...prev.products];
      copy[pIndex].productId = productId;
      copy[pIndex].species = "";
      return { ...prev, products: copy };
    });

    if (productId) fetchProductDetails(productId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    "packing",
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

  // Date validations
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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Header onBack={() => (window.location.href = "/dashboard")} />

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >

             <Section title="Draft Details">
            <div className="grid sm:grid-cols-2 gap-6">
              <ReadOnlyField label="Draft Name" value={formData.draftName} />
              <InputField required={true} label="Packing" name="packing" value={formData.packing} onChange={handleChange} />
              <InputField required={true} label="Quantity (MT)" name="quantity" value={formData.quantity} onChange={handleChange} />
              <InputField required={true} label="Tolerance (%)" name="tolerance" value={formData.tolerance} onChange={handleChange} />
              <InputField required={true} label="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} />
              <InputField required={true} label="Remarks" name="remark" value={formData.remark} onChange={handleChange} />
              <InputField required={true} label="Grand Total (USD)" name="grandTotal" value={formData.grandTotal} onChange={handleChange} />
            </div>
          </Section>

           <Section title="Dates">
            <div className="grid sm:grid-cols-2 gap-6">
              <DatePicker label="Offer Validity Date" value={formData.offerValidityDate} onSelect={(d) => handleDateSelect("offerValidityDate", d)} open={openPicker.validity} setOpen={(v) => setOpenPicker(prev => ({ ...prev, validity: v }))} />
              <DatePicker label="Shipment Date" value={formData.shipmentDate} onSelect={(d) => handleDateSelect("shipmentDate", d)} open={openPicker.shipment} setOpen={(v) => setOpenPicker(prev => ({ ...prev, shipment: v }))} />
            </div>
          </Section>

          <Section title="Business Information">
            <div className="grid sm:grid-cols-2 gap-6">
              <ReadOnlyField label="From Party" value={formData.fromParty} />
              <InputField required={true} label="Origin" name="origin" value={formData.origin} onChange={handleChange}/>
              <InputField required={true} label="Processor" name="processor" value={formData.processor} onChange={handleChange} />
              <InputField required={true} label="Plant Approval Number" name="plantApprovalNumber" value={formData.plantApprovalNumber} onChange={handleChange}/>
              <InputField required={true} label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
            </div>
          </Section>

          <Section title="Products">
            <ProductSection
              productsData={formData.products || []}
              setFormData={setFormData}
              productsList={productsList}
              speciesMap={speciesMap}
              onProductSelect={handleProductSelect}
              readOnly={false}
            />
          </Section>

          <Footer loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default CreateOfferDraft;
