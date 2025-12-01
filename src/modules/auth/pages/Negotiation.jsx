import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import negotiationServices from "../../negotiation/services";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const Negotiation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [negotiation, setNegotiation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchNegotiations = async () => {
      try {
        setLoading(true);
        const res = await negotiationServices.getNegotiationbyId(id);
        const data = res?.data?.data?.negotiations;

        if (!data) throw new Error("No negotiation data found.");

        setNegotiation(data);
      } catch (err) {
        console.error("Failed to fetch negotiations:", err);
        setError("Failed to fetch negotiation data.");
      } finally {
        setLoading(false);
      }
    };

    fetchNegotiations();
  }, [id]);

  const handleRespond = (action) => {
    setPendingAction(action);
    setConfirmOpen(true);
  };

  const confirmRespond = async () => {
    if (!pendingAction) return;
    
    setConfirmOpen(false);
  try {
    const payload = {
      buyerId: negotiation?.offer?.buyerId,
      action: pendingAction,
    };

    const res = await negotiationServices.offerResponse(id, payload);

    toast.success(res?.data?.message || `Offer ${pendingAction}ed successfully`);

    navigate("/offers");
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to respond to offer.");
    } finally {
      setPendingAction(null);
    }
  };

  const getModalContent = () => {
    switch (pendingAction) {
      case "accept":
        return {
          title: "Accept Offer",
          description: "Are you sure you want to accept this offer? This action cannot be undone.",
          confirmText: "Accept Offer",
          confirmButtonColor: "bg-emerald-600 hover:bg-emerald-700"
        };
      case "reject":
        return {
          title: "Reject Offer",
          description: "Are you sure you want to reject this offer? This action cannot be undone.",
          confirmText: "Reject Offer", 
          confirmButtonColor: "bg-rose-600 hover:bg-rose-700"
        };
      default:
        return {
          title: "Confirm Action",
          description: "Are you sure you want to proceed?",
          confirmText: "Confirm",
          confirmButtonColor: "bg-blue-600 hover:bg-blue-700"
        };
    }
  };

  const modalContent = getModalContent();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-blue-600 mb-4"></div>
          <div className="text-gray-700 font-medium">Loading negotiations...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            </div>
            <p className="font-semibold text-gray-900 mb-1">Error Loading Data</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!negotiation || !negotiation.history?.length)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          </div>
          <p className="text-gray-900 font-semibold">No Negotiation History</p>
          <p className="text-gray-600 text-sm mt-1">No negotiation data available for this offer.</p>
        </div>
      </div>
    );

  const { offer, history, products } = negotiation;
  const productMeta = products?.[0] || {};
  const version = history[currentPage];

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "-";

  const handlePrev = () =>
    setCurrentPage((p) => (p > 0 ? p - 1 : history.length - 1));

  const handleNext = () =>
    setCurrentPage((p) => (p < history.length - 1 ? p + 1 : 0));


  const handleNegotiate = () => {
    navigate(`/latest-negotiation/${id}`);
  };

  const leftFields = [
    { label: "Offer Name", key: "offerName", source: "offer" },
    { label: "Offer Date", key: "createdAt", source: "offer" },
    { label: "From Name", key: "fromParty", source: "offer" },
    { label: "To Party", key: "toParty", source: "offer" },
    { label: "Offer Validity", key: "offerValidityDate", source: "offer" },
    { label: "Shipment Date", key: "shipmentDate", source: "offer" },
    { label: "Processor", key: "processor", source: "offer" },
    { label: "Plant Approval", key: "plantApprovalNumber", source: "offer" },
    { label: "Brand", key: "brand", source: "offer" },
    { label: "Origin", key: "origin", source: "offer" },
    { label: "Destination", key: "destination", source: "offer" },
    { label: "Product", key: "productName", source: "version" },
    { label: "Species", key: "speciesName", source: "version" },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">

      <div className="px-6 py-3 bg-white border-b border-gray-200 shrink-0 shadow-sm">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-md transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="px-4 py-1.5 bg-blue-600 rounded-md shadow-sm">
              <span className="text-sm font-semibold text-white">
                Version {version.versionNo} of {history.length}
              </span>
            </div>
            
            <button
              onClick={handleNext}
              className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-md transition-colors cursor-pointer"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRespond("accept")}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accept
                </span>
            </button>

            <button
            onClick={() => handleRespond("reject")}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors cursor-pointer"
            >
                <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
                </span>
            </button>

            <button
              onClick={handleNegotiate}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors cursor-pointer"
            >
                <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Negotiate
                </span>
        </button>
          </div>
      </div>
          </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-50">
        <div className="h-full px-6 py-4">
          <div
            className="grid gap-3 h-full"
            style={{
              gridTemplateColumns: `220px repeat(${history.length}, 360px)`,
            }}
          >
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm flex flex-col">
              <div className="bg-gray-800 text-white px-4 py-2.5 shrink-0">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-semibold text-xs uppercase tracking-wide">Subject</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
              {leftFields.map((field, idx) => (
                <div 
                  key={field.key} 
                  className={`px-4 py-2 text-[11px] font-medium text-gray-700 border-b border-gray-200 ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  {field.label}
            </div>
          ))}

          <div className="px-4 py-2 text-[11px] font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
            Size/Grades
          </div>

          <div className="px-4 py-2 text-[11px] font-medium text-gray-700 border-b border-gray-200 bg-white">
            Units/Remarks
          </div>

          {version.sizeBreakups?.map((row, i) => (
            <div 
                  key={i} 
                  className={`px-4 py-2 text-[11px] font-medium text-gray-700 border-b border-gray-200 ${
                    i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                {row.size}
            </div>
          ))}
              </div>
          </div>


          {history.map((neg, idx) => {
            const selected = idx === currentPage;

            return (
              <div
                key={idx}
                className={`rounded-lg overflow-hidden transition-all duration-200 flex flex-col shadow-sm ${
                    selected
                        ? "bg-white border-2 border-blue-500 shadow-lg"
                      : "bg-white border border-gray-200"                }`}              >                <div className={`px-4 py-2.5 text-center text-white font-semibold text-xs shrink-0 ${
                    selected 
                        ? "bg-blue-600" 
                        : "bg-gray-700"
                    }`}>
                                            <div className="flex items-center justify-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate">{neg.fromParty || "Offer"}</span>
                      </div>
                      </div>

                  <div className="flex-1 overflow-y-auto">
                  {leftFields.map((field, fieldIdx) => {
                        const source = field.source === "offer" ? offer : neg;
                  const val = field.key.toLowerCase().includes("date")
                    ? formatDate(source[field.key])
                    : source[field.key] || "-";

                  return (
                    <div
                      key={field.key}
                      className={`px-4 py-2 text-[11px] text-gray-800 font-medium border-b border-gray-200 truncate ${
                          fieldIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                          title={val}
                    >
                      {val}
                    </div>
                  );
                })}

                <div className="px-4 py-2 text-[11px] text-gray-400 border-b border-gray-200 bg-gray-50">
                  -
                </div>

                <div className="px-4 py-2 text-[11px] font-semibold text-gray-800 border-b border-gray-200 bg-white">
                  {neg.quantity || "-"}
                </div>


                <div className="border-t-2 border-gray-300">
                                  
                          <div className="grid grid-cols-4 bg-gray-100 text-[10px] font-semibold border-b border-gray-300 text-gray-700">
                      <div className="py-2 px-2 text-center border-r border-gray-300">
                              <div className="mb-0.5 uppercase">Breakup</div>
                              {productMeta.breakupDetails && (
                        <div className="text-[8px] text-gray-600 font-normal truncate">
                          {productMeta.breakupDetails}
                        </div>
                              )}
                      </div>

                      <div className="py-2 px-2 text-center border-r border-gray-300 uppercase">
                        Condition
                      </div>

                      <div className="py-2 px-2 text-center border-r border-gray-300">
                              <div className="mb-0.5 uppercase">Price</div>
                              {productMeta.priceDetails && (
                        <div className="text-[8px] text-gray-600 font-normal truncate">
                          {productMeta.priceDetails}
                        </div>
                              )}
                      </div>

                      <div className="py-2 px-2 text-center uppercase">
                        Packing
                      </div>
                    </div>

                    {neg.sizeBreakups?.map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-4 text-[11px] border-b border-gray-200 ${
                                i % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }`}
                      >
                        <div className="py-2 px-2 text-center border-r border-gray-200 font-medium text-gray-800 truncate">
                          {row.breakup}
                        </div>
                        <div className="py-2 px-2 text-center border-r border-gray-200 text-gray-700 truncate">
                          {row.condition}
                        </div>
                        <div className="py-2 px-2 text-center border-r border-gray-200 font-semibold text-emerald-600 truncate">
                          {row.price}
                        </div>
                        <div className="py-2 px-2 text-center text-gray-700 truncate">
                          {productMeta.packing || "-"}
                        </div>
                      </div>
                    ))}
                    </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingAction(null);
        }}
        onConfirm={confirmRespond}
        title={modalContent.title}
        description={modalContent.description}
        confirmText={modalContent.confirmText}
        cancelText="Cancel"
        confirmButtonColor={modalContent.confirmButtonColor}
      />
    </div>
  );
};

export default Negotiation;
