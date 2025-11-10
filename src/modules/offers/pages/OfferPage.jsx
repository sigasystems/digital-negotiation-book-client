import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { offerService } from "../services";
import toast from "react-hot-toast";
import DatePicker from "@/modules/offerDraft/components/DatePicker";
import ProductSection from "@/modules/offerDraft/components/ProductSection";

const OfferPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [openPicker, setOpenPicker] = useState({ validity: false, shipment: false });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const FIELD_LABELS = {
    offerName: "Offer Name",
    businessName: "Business Name",
    productName: "Product Name",
    speciesName: "Species Name",
    packing: "Packing",
    draftName: "Draft Name",
    quantity: "Quantity",
    tolerance: "Tolerance",
    paymentTerms: "Payment Terms",
    remark: "Remark",
    grandTotal: "Grand Total",
    sizeBreakups: "Size Breakups",
    origin: "Origin",
    processor: "Processor",
    plantApprovalNumber: "Plant Approval No",
    brand: "Brand",
    shipmentDate: "Shipment Date",
    offerValidityDate: "Offer Validity",
  };

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const res = await offerService.getOfferById(id);
        const data = res?.data?.data?.offer || res.message || null;
        if (!data) {
          toast.error("Offer not found.");
          return;
        }

        const computedTotal = (data.sizeBreakups || []).reduce(
          (sum, s) => sum + (Number(s.breakup) || 0),
          0
        );

        setOffer(data);

        setFormData({
          ...data,
          total: computedTotal,
          sizeBreakups: data.sizeBreakups?.length
            ? data.sizeBreakups.map((s) => ({
                ...s,
                breakup: Number(s.breakup) || 0,
                price: Number(s.price) || 0,
              }))
            : [{ size: "", breakup: 0, price: 0 }],

          grandTotal: computedTotal,

          quantity: data.quantity ?? "",
          tolerance: data.tolerance ?? "",
          offerValidityDate: data.offerValidityDate ? new Date(data.offerValidityDate) : null,
          shipmentDate: data.shipmentDate ? new Date(data.shipmentDate) : null,
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch offer details");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
}, [id]);


  const handleDateSelect = useCallback((field, date) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    setOpenPicker((prev) => ({
      ...prev,
      [field === "offerValidityDate" ? "validity" : "shipment"]: false,
    }));
  }, []);

  const handleBreakupChange = useCallback((idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sizeBreakups];
      updated[idx] = {
        ...updated[idx],
        [field]: ["breakup", "price"].includes(field) ? Number(value) || 0 : value,
      };
      return { ...prev, sizeBreakups: updated };
    });
  }, []);

  const addBreakupRow = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      sizeBreakups: [...prev.sizeBreakups, { size: "", breakup: 0, price: 0 }],
    }));
  }, []);

  const removeBreakupRow = useCallback((idx) => {
    setFormData((prev) => {
      const updated = prev.sizeBreakups.filter((_, i) => i !== idx);
      return {
        ...prev,
        sizeBreakups: updated.length ? updated : [{ size: "", breakup: 0, price: 0 }],
      };
    });
  }, []);

  const total = (formData.sizeBreakups || []).reduce((sum, s) => sum + (Number(s.breakup) || 0), 0);

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
        total,
        grandTotal: total,
        sizeBreakups: (formData.sizeBreakups || []).map((s) => ({
          ...s,
          breakup: Number(s.breakup) || 0,
          price: Number(s.price) || 0,
        })),
        quantity: String(formData.quantity ?? ""),
        tolerance: String(formData.tolerance ?? ""),
        offerValidityDate: formData.offerValidityDate ? new Date(formData.offerValidityDate) : null,
        shipmentDate: formData.shipmentDate ? new Date(formData.shipmentDate) : null,
      };

      await offerService.updateOffer(id, payload);
      toast.success("Offer updated successfully!");
      setOffer(payload);
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update offer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
          <p className="text-slate-600 font-medium">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        Offer not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="sticky top-0 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Offer Details - {offer.offerName}
          </h1>
          <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-300">
            {offer.status?.toUpperCase() || "N/A"}
          </Badge>
        </div>
      </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">From Party Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {["origin", "processor", "plantApprovalNumber", "brand", "fromParty", "businessName"].map((key) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-slate-700">{FIELD_LABELS[key]}</label>
                    <Input
                      value={formData[key] ?? ""}
                      disabled
                      className="mt-1 bg-slate-100 text-slate-600 cursor-not-allowed"
                    />
                  </div>
              ))}
            <div>
              <label className="text-sm font-medium text-slate-700">Quantity</label>
              <Input value={formData.quantity ?? ""} disabled className="mt-1 bg-slate-100 text-slate-600 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Tolerance</label>
              <Input value={formData.tolerance ?? ""} disabled className="mt-1 bg-slate-100 text-slate-600 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Payment Terms</label>
              <Input value={formData.paymentTerms ?? ""} disabled className="mt-1 bg-slate-100 text-slate-600 cursor-not-allowed" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Remarks</label>
              <Input value={formData.remark ?? ""} disabled className="mt-1 bg-slate-100 text-slate-600 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Grand Total</label>
              <Input value={total} disabled className="mt-1 bg-slate-100 text-slate-600 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Product & Draft Details</h2>
          <ProductSection
            formData={formData}
            handleChange={(e) => {
              const { name, value } = e.target;
              setFormData((prev) => ({
                ...prev,
                [name]: ["grandTotal"].includes(name) ? Number(value) || 0 : value,
              }));
            }}
            handleBreakupChange={handleBreakupChange}
            addBreakupRow={addBreakupRow}
            removeBreakupRow={removeBreakupRow}
            total={total}
            readOnly={!isEditing}
          />

          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <DatePicker
              label="Offer Validity Date"
              value={formData.offerValidityDate}
              onSelect={(date) => handleDateSelect("offerValidityDate", date)}
              open={openPicker.validity}
              setOpen={(val) => setOpenPicker((p) => ({ ...p, validity: val }))}
            />
            <DatePicker
              label="Shipment Date"
              value={formData.shipmentDate}
              onSelect={(date) => handleDateSelect("shipmentDate", date)}
              open={openPicker.shipment}
              setOpen={(val) => setOpenPicker((p) => ({ ...p, shipment: val }))}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            {!isEditing && <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>}
            {isEditing && (
              <>
                <Button variant="outline" onClick={() => { setIsEditing(false); setFormData(offer); }}>Cancel</Button>
                <Button variant="default" onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfferPage;
