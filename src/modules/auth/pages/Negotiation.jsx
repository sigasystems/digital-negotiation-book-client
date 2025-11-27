import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import negotiationServices from "../../negotiation/services";
import toast from "react-hot-toast";

const Negotiation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [negotiation, setNegotiation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

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

  const handleRespond = async (action) => {
  try {
    const payload = {
      buyerId: negotiation?.offer?.buyerId,
      action,
    };

    const res = await negotiationServices.offerResponse(id, payload);

    toast.success(res?.data?.message || `Offer ${action}ed successfully`);

    navigate("/offers");
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to respond to offer.");
  }
};

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <div className="text-gray-700 font-semibold text-lg">Loading negotiations...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md mx-4 border border-red-100">
          <div className="text-red-600 text-center">
            <div className="w-20 h-20 mx-auto mb-5 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            </div>
            <p className="font-bold text-xl mb-2">Error Loading Data</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!negotiation || !negotiation.history?.length)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md mx-4 text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          </div>
          <p className="text-gray-700 font-semibold text-lg">No Negotiation History</p>
          <p className="text-gray-500 text-sm mt-2">No negotiation data available for this offer.</p>
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
    { label: "Offer Validity Date", key: "offerValidityDate", source: "offer" },
    { label: "Shipment Date", key: "shipmentDate", source: "offer" },
    { label: "Processor", key: "processor", source: "offer" },
    { label: "Plant Approval No.", key: "plantApprovalNumber", source: "offer" },
    { label: "Brand", key: "brand", source: "offer" },
    { label: "Origin", key: "origin", source: "offer" },
    { label: "Destination", key: "destination", source: "offer" },
    { label: "Product", key: "productName", source: "version" },
    { label: "Species", key: "speciesName", source: "version" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">

        <div className="sticky top-0 z-30 bg-gradient-to-br from-slate-50/95 via-blue-50/95 to-indigo-100/95 backdrop-blur-sm pb-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mb-4">
            <button
            onClick={() => handleRespond("accept")}
                className="group relative px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Accept Offer
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
            onClick={() => handleRespond("reject")}
                className="group relative px-8 py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject Offer
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={handleNegotiate}
              className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Negotiate
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={handlePrev}
          className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
        </button>
            
            <div className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md">
              <span className="text-sm font-bold text-white">
                Version {version.versionNo} of {history.length}
              </span>
            </div>
            
        <button
          onClick={handleNext}
          className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
        </button>
          </div>
      </div>
          </div>

        <div className="hidden lg:block overflow-x-auto pb-8">
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: `280px repeat(${history.length}, 440px)`,
            }}
          >
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-2 border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-5 py-5">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-bold text-base tracking-wide">SUBJECT</span>
                </div>
              </div>

              {leftFields.map((field, idx) => (
                <div 
                  key={field.key} 
                  className={`px-5 py-4 text-sm font-semibold text-gray-700 flex items-center border-b border-gray-200 transition-colors hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  {field.label}
            </div>
          ))}

          <div className="px-5 py-4 font-semibold text-sm text-gray-700 flex items-center border-b border-gray-200 bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors">
            Size/Grades
          </div>

          <div className="px-5 py-4 font-semibold text-sm text-gray-700 flex items-center border-b border-gray-200 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors">
            Units/Remarks
          </div>

          {version.sizeBreakups?.map((row, i) => (
            <div 
                  key={i} 
                  className={`px-5 py-4 font-semibold text-sm text-gray-700 flex items-center border-b border-gray-200 transition-colors hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                    i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                {row.size}
            </div>
          ))}
          </div>


          {history.map((neg, idx) => {
            const selected = idx === currentPage;

            return (
              <div
                key={idx}
                className={`shadow-2xl rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
                    selected
                        ? "border-4 border-blue-500 ring-4 ring-blue-200 scale-[1.02]"
                        : "border-2 border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className={`px-5 py-5 text-center text-white font-bold text-base relative overflow-hidden ${
                    selected 
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" 
                        : "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800"
                    }`}>
                      <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{neg.fromParty || "Offer"}</span>
                      </div>
                </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
                      </div>

                  {leftFields.map((field, fieldIdx) => {
                        const source = field.source === "offer" ? offer : neg;
                  const val = field.key.toLowerCase().includes("date")
                    ? formatDate(source[field.key])
                    : source[field.key] || "-";

                  return (
                    <div
                      key={field.key}
                      className={`px-5 py-4 text-sm text-gray-800 font-medium flex items-center border-b border-gray-200 transition-colors hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                          fieldIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                    >
                      {val}
                    </div>
                  );
                })}

                <div className="px-5 py-4 text-sm text-gray-500 flex items-center border-b border-gray-200 bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors">
                  -
                </div>

                <div className="px-5 py-4 text-sm font-semibold text-gray-800 flex items-center border-b border-gray-200 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors">
                  {neg.quantity || "-"}
                </div>


                <div className="border-t-4 border-gray-300">
                                  
                          <div className="grid grid-cols-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-xs font-bold border-b-2 border-gray-300 text-gray-700">
                      <div className="py-4 px-3 text-center border-r border-gray-300">
                              <div className="mb-1">BREAKUP</div>
                              {productMeta.breakupDetails && (
                        <div className="text-[10px] text-gray-600 font-normal">
                          {productMeta.breakupDetails}
                        </div>
                              )}
                      </div>

                      <div className="py-4 px-3 text-center border-r border-gray-300">
                        CONDITION
                      </div>

                      <div className="py-4 px-3 text-center border-r border-gray-300">
                              <div className="mb-1">PRICE</div>
                              {productMeta.priceDetails && (
                        <div className="text-[10px] text-gray-600 font-normal">
                          {productMeta.priceDetails}
                        </div>
                              )}
                      </div>

                      <div className="py-4 px-3 text-center">
                        PACKING
                      </div>
                    </div>

                    {neg.sizeBreakups?.map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-4 text-sm border-b border-gray-200 transition-colors hover:bg-blue-50 ${
                                i % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                      >
                        <div className="py-4 px-3 text-center border-r border-gray-200 font-semibold text-gray-700">
                          {row.breakup}
                        </div>
                        <div className="py-4 px-3 text-center border-r border-gray-200 text-gray-600">
                          {row.condition}
                        </div>
                        <div className="py-4 px-3 text-center border-r border-gray-200 font-bold text-emerald-600">
                          {row.price}
                        </div>
                        <div className="py-4 px-3 text-center text-gray-600">
                          {productMeta.packing || "-"}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}

            </div>
        </div>

        <div className="lg:hidden">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-700 font-semibold text-lg mb-2">Desktop View Required</p>
            <p className="text-gray-500 text-sm">Please use a desktop or tablet device to view negotiation details.</p>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Negotiation;
