import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import negotiationServices from "../services";

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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600 font-medium">Loading negotiations...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-red-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-lg">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!negotiation || !negotiation.history?.length)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 font-medium">No negotiation history found.</p>
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

  const handleAccept = () => {
  };

  const handleReject = () => {
  };

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
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-[1920px] mx-auto p-3 sm:p-6 lg:p-8">
        
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 text-center lg:text-left">
            Negotiation Details
          </h1>
          <p className="text-gray-600 text-sm sm:text-base text-center lg:text-left">
            Review and manage your negotiation versions
          </p>
        </div>

        <div className="sticky top-0 z-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <button
              onClick={handleAccept}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Accept
            </button>

            <button
              onClick={handleReject}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>

            <button
              onClick={handleNegotiate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Negotiate
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
        </button>
            
            <div className="px-6 py-2 bg-white rounded-full shadow-md">
              <span className="text-sm font-semibold text-gray-700">
                Version {version.versionNo} of {history.length}
              </span>
            </div>
            
        <button
          onClick={handleNext}
          className="flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
        </button>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

          <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-48 bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-4">
            SUBJECT
          </div>

          {leftFields.map((field) => (
            <div key={field.key} className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <div className="font-semibold text-sm text-gray-800">
                {field.label}
              </div>
            </div>
          ))}

          <div className="border-b border-gray-200 p-4 font-semibold text-sm text-gray-800 hover:bg-gray-50 transition-colors">
            Size/Grades
          </div>

          <div className="border-b border-gray-200 p-4 font-semibold text-sm text-gray-800 hover:bg-gray-50 transition-colors">
            Units/Remarks
          </div>

          {version.sizeBreakups?.map((row, idx) => (
            <div key={idx} className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <div className="font-semibold text-sm text-gray-900">
                {row.size}
              </div>
            </div>
          ))}
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-4 pb-4 min-w-min">

          {history.map((neg, idx) => {
            const isSelected = idx === currentPage;

            return (
              <div
                key={idx}
                className={`w-full sm:w-96 lg:w-[420px] shrink-0 shadow-xl rounded-2xl border-2 bg-white transition-all duration-300 ${
                  isSelected 
                        ? "border-blue-500 ring-4 ring-blue-200 transform scale-[1.02]" 
                        : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className={`text-white text-base font-bold px-5 py-4 text-center rounded-t-xl ${
                      isSelected 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600" 
                        : "bg-gradient-to-r from-gray-600 to-gray-700"
                    }`}>
                  {neg.fromParty || "Offer"}
                      {isSelected && (
                        <div className="text-xs font-normal mt-1 opacity-90">
                          Current Version
                        </div>
                      )}
                </div>

                    <div className="lg:hidden">
                {leftFields.map((field) => {
                  const source = field.source === "offer" ? offer : neg;

                        const value = field.key.toLowerCase().includes("date")
                          ? formatDate(source[field.key])
                          : source[field.key] || "-";

                        return (
                          <div key={field.key} className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                            <div className="text-xs font-semibold text-gray-600 mb-1">
                              {field.label}
                            </div>
                            <div className="text-sm text-gray-900 font-medium">
                              {value}
                            </div>
                          </div>
                        );
                      })}

                      <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          Size/Grades
                        </div>
                        <div className="text-sm text-gray-900">-</div>
                      </div>

                      <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          Units/Remarks
                        </div>
                        <div className="text-sm text-gray-900 font-medium">
                          {neg.quantity || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:block">
                      {leftFields.map((field) => {
                        const source = field.source === "offer" ? offer : neg;
                  const value = field.key.toLowerCase().includes("date")
                    ? formatDate(source[field.key])
                    : source[field.key] || "-";

                  return (
                    <div
                      key={field.key}
                      className="border-b border-gray-200 p-4 text-sm text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                    >
                      {value}
                    </div>
                  );
                })}

                <div className="border-b border-gray-200 p-4 text-sm text-gray-900">
                  -
                </div>

                <div className="border-b border-gray-200 p-4 text-sm text-gray-900 font-medium">
                  {neg.quantity || "-"}
                </div>

                    </div>

                <div className="border-t-2 border-gray-300 mt-2">
                      <div className="overflow-x-auto">
                  <div className="min-w-[340px]">

                          <div className="grid grid-cols-4 bg-gradient-to-r from-gray-100 to-gray-200 text-[11px] sm:text-xs font-bold border-b-2 border-gray-300 text-gray-700">
                      <div className="py-3 px-2 text-center border-r border-gray-300">
                              <div>Breakup</div>
                              {productMeta.breakupDetails && (
                        <div className="text-[10px] mt-1 text-gray-600 font-normal">
                          {productMeta.breakupDetails}
                        </div>
                              )}
                      </div>

                      <div className="py-3 px-2 text-center border-r border-gray-300">
                        Condition
                      </div>

                      <div className="py-3 px-2 text-center border-r border-gray-300">
                              <div>Price</div>
                              {productMeta.priceDetails && (
                        <div className="text-[10px] mt-1 text-gray-600 font-normal">
                          {productMeta.priceDetails}
                        </div>
                              )}
                      </div>

                      <div className="py-3 px-2 text-center">
                        Packing
                      </div>
                    </div>

                    {neg.sizeBreakups?.map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-4 text-xs sm:text-sm border-b border-gray-200 ${
                                i % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } hover:bg-blue-50 transition-colors`}
                      >
                        <div className="py-3 px-2 text-center border-r border-gray-200 font-medium">
                          {row.breakup}
                        </div>
                        <div className="py-3 px-2 text-center border-r border-gray-200">
                          {row.condition}
                        </div>
                        <div className="py-3 px-2 text-center border-r border-gray-200 font-semibold text-green-700">
                          {row.price}
                        </div>
                        <div className="py-3 px-2 text-center">
                          {productMeta.packing || "-"}
                        </div>
                      </div>
                    ))}
                        </div>
                  </div>
                </div>
              </div>
            );
          })}

            </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Negotiation;
