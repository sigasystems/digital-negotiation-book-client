import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { offerService } from "../services";
import toast from "react-hot-toast";

const OfferPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fields that should remain read-only
  const READ_ONLY_FIELDS = [
    "id",
    "businessOwnerId",
    "fromParty",
    "processor",
    "brand",
    "draftName",
    "createdAt",
    "updatedAt",
    "isDeleted",
    "status",
  ];

  // Labels for fields
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
        setOffer(data);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch offer details");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id, navigate]);

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
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover:bg-slate-100 cursor-pointer"
          >
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Offer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.keys(FIELD_LABELS).map((key) => {
                const value = offer[key];
                if (value === undefined) return null;

                let displayValue = value;

                // If it's an array (like sizeBreakups), stringify for display
                if (Array.isArray(value)) displayValue = JSON.stringify(value, null, 2);

                return (
                  <div key={key}>
                    <label className="text-sm font-medium text-slate-700">
                      {FIELD_LABELS[key]}
                    </label>
                    <Input
                      value={displayValue ?? ""}
                      disabled={READ_ONLY_FIELDS.includes(key)}
                      className={`mt-1 ${
                        READ_ONLY_FIELDS.includes(key)
                          ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                          : "bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500"
                      }`}
                      readOnly={READ_ONLY_FIELDS.includes(key)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfferPage;
