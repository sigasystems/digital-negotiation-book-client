import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { offerDraftService } from "../services";
import { productService } from "@/modules/product/services";
import { createHandleProductSelect } from "@/utils/getAllProducts";
import { validateOfferDates } from "@/utils/formateDate";
import { InputField } from "@/components/common/InputField";
import Section from "../components/Section";
import ReadOnlyField from "../components/ReadOnlyField";
import ProductSection from "../components/ProductSection";
import DatePicker from "../components/DatePicker";
import FormActions from "../components/FormActions";

const ViewOfferDraft = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    }
  };

  if (loading || !formData)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <form className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex justify-end p-6 border-b bg-gray-50">
          <button
            type="button"
            onClick={() =>
              navigate(`/offer/${formData.draftNo}`, {
                state: { draftId: id },
              })
            }
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Create Offer
          </button>
        </div>

          {/* BUSINESS INFO */}
          <Section title="Business Information">
            <div className="grid sm:grid-cols-2 gap-6">
              <ReadOnlyField label="Draft Number" value={formData.draftNo} />
                  <InputField label="From Party" name="fromParty" value={formData.fromParty} onChange={handleChange} />
                  <InputField label="Origin" name="origin" value={formData.origin} onChange={handleChange} />
                  <InputField label="Processor" name="processor" value={formData.processor} onChange={handleChange} />
                  <InputField label="Plant Approval Number" name="plantApprovalNumber" value={formData.plantApprovalNumber} onChange={handleChange} />
                  <InputField label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
                </div>
          </Section>

          <Section title="Draft Details">
            <div className="grid sm:grid-cols-2 gap-6">

              <InputField label="Draft Name" name="draftName" value={formData.draftName} onChange={handleChange} />

              <InputField label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
              <InputField label="Tolerance" name="tolerance" value={formData.tolerance} onChange={handleChange} />
                  <InputField label="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} />
                  <InputField label="Remark" name="remark" value={formData.remark} onChange={handleChange} />
              <InputField label="Grand Total" name="grandTotal" value={formData.grandTotal} onChange={handleChange} />
            </div>
          </Section>

          {/* DATES */}
          <Section title="Dates">
            <div className="grid sm:grid-cols-2 gap-6">
              <DatePicker label="Offer Validity Date" value={formData.offerValidityDate} onSelect={(d) => handleDateSelect("offerValidityDate", d)} open={openPicker.validity} setOpen={(v) => setOpenPicker((p) => ({ ...p, validity: v }))} />

              <DatePicker label="Shipment Date" value={formData.shipmentDate} onSelect={(d) => handleDateSelect("shipmentDate", d)} open={openPicker.shipment} setOpen={(v) => setOpenPicker((p) => ({ ...p, shipment: v }))} />
            </div>
          </Section>

          {/* PRODUCTS */}
          <Section title="Product & Size Details">
            <ProductSection
              productsData={formData.products}
              setFormData={setFormData}
              productsList={productsList}
              speciesMap={speciesMap}
              onProductSelect={handleProductSelect}
            />
          </Section>

          <FormActions
            isEditing={true}
            isChanged={JSON.stringify(formData) !== JSON.stringify(originalData)}
            submitting={false}
            onCancel={() => navigate(-1)}
            onSave={handleSave}
            onBack={() => navigate(-1)}
          />
        </form>
      </div>
    </div>
  );
};

export default ViewOfferDraft;
