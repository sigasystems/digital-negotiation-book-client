import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { offerService } from "../services";
import { offerDraftService } from "@/modules/offerDraft/services";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import ProductSection from "@/modules/offerDraft/components/ProductSection";

const CreateOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const draftId = location.state?.draftId || params.id;

  const [draft, setDraft] = useState(null);
  const [offerData, setOfferData] = useState({
    productName: "",
    speciesName: "",
    packing: "",
    draftName: "",
    quantity: "",
    tolerance: "",
    paymentTerms: "",
    remark: "",
    grandTotal: "",
    sizeBreakups: [],
  });

  const [offerName, setOfferName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!draftId) {
      toast.error("Invalid draft reference.");
      navigate(-1);
      return;
    }

    const loadDraft = async () => {
      try {
        const res = await offerDraftService.getDraftById(draftId);
        const data = res?.data?.data?.draft || null;

        if (!data) {
          toast.error("Draft not found.");
          navigate(-1);
          return;
        }

        setDraft(data);
        setOfferData((prev) => ({
          ...prev,
          ...data,
          sizeBreakups: data.sizeBreakups || prev.sizeBreakups,
        }));

        setOfferName("");
      } catch (err) {
        toast.error("Failed to load draft details.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadDraft();
  }, [draftId]);

  const handleInputChange = (key, value) => {
    setOfferData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBreakupChange = (idx, field, value) => {
    setOfferData((prev) => {
      const updated = [...prev.sizeBreakups];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, sizeBreakups: updated };
    });
  };

  const addBreakupRow = () => {
    setOfferData((prev) => ({
      ...prev,
      sizeBreakups: [...prev.sizeBreakups, { size: "", breakup: 0, price: 0 }],
    }));
  };

  const removeBreakupRow = (idx) => {
    setOfferData((prev) => {
      const updated = prev.sizeBreakups.filter((_, i) => i !== idx);
      return { ...prev, sizeBreakups: updated };
    });
  };

  const total = offerData.sizeBreakups?.reduce(
    (sum, row) => sum + Number(row.breakup || 0),
    0
  );

  const handleCreateOffer = () => {
    if (!offerName.trim()) {
      toast.error("Offer name is required.");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmCreate = async () => {
    setConfirmOpen(false);
    setCreating(true);

    try {
      await offerService.createOffer(draftId, offerName);
      toast.success("Offer created successfully");
      navigate("/offers");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create offer");
    } finally {
      setCreating(false);
    }
  };

  const NON_EDITABLE_FIELDS = [
    "draftNo",
    "businessOwnerId",
    "fromParty",
    "processor",
    "brand",
  ];

  const draftFields = {
    draftNo: "Draft Number",
    businessOwnerId: "Business Owner ID",
    fromParty: "From Party",
    origin: "Origin",
    processor: "Processor",
    plantApprovalNumber: "Plant Approval No",
    brand: "Brand",
    draftName: "Draft Name",
    offerValidityDate: "Offer Validity",
    shipmentDate: "Shipment Date",
    grandTotal: "Grand Total",
    quantity: "Quantity",
    tolerance: "Tolerance",
    paymentTerms: "Payment Terms",
    remark: "Remark",
    productName: "Product Name",
    speciesName: "Species Name",
    packing: "Packing",
    total: "Total",
    status: "Status",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        Loading draft details...
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Draft not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">

      <header className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="hidden sm:block h-6 w-px bg-slate-300" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow">
                <FilePlus2 className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Create Offer</h1>
                <p className="text-xs text-slate-500">From Draft #{draft.draftNo}</p>
              </div>
            </div>
          </div>

          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
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
            required={true}
            onChange={(e) => setOfferName(e.target.value)}
            className="mt-2 bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow p-6">
          <h2 className="font-semibold text-lg text-slate-800 mb-4">Basic Draft Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Object.entries(draftFields).map(([key, label]) => (
              <div key={key}>
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <Input
                  value={offerData[key] ?? ""}
                  disabled={NON_EDITABLE_FIELDS.includes(key)}
                  onChange={(e) =>
                    !NON_EDITABLE_FIELDS.includes(key) &&
                    handleInputChange(key, e.target.value)
                  }
                  className={`mt-1 ${
                    NON_EDITABLE_FIELDS.includes(key)
                      ? "bg-slate-100 cursor-not-allowed text-slate-600"
                      : "bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

       <ProductSection
        formData={offerData}
        handleChange={handleInputChange}
        handleBreakupChange={handleBreakupChange}
        addBreakupRow={addBreakupRow}
        removeBreakupRow={removeBreakupRow}
        total={total}
      />

        <div className="sticky bottom-0 bg-white border-t border-slate-200 py-4 shadow-lg sm:shadow-none">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-end gap-3 px-4">
            <Button variant="outline" onClick={() => navigate(-1)} disabled={creating} className="w-full sm:w-auto">
              Cancel
            </Button>

            <Button
              onClick={handleCreateOffer}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-pointer"
            >
              {creating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> :
                <><Save className="w-4 h-4 mr-2" />Create Offer</>}
            </Button>
          </div>
        </div>

        <div className="h-20 sm:hidden" />
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
