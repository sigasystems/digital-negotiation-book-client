import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import negotiationServices from "../services";

const Negotiation = () => {
  const { id } = useParams();
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
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading negotiations...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-medium py-6">{error}</div>
    );

  if (!negotiation || !negotiation.history?.length)
    return (
      <div className="text-center text-gray-500 py-6">
        No negotiation history found.
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
    { label: "Destination", key: "destination", source: "version" },
    { label: "Product", key: "productName", source: "version" },
    { label: "Species", key: "speciesName", source: "version" },
  ];

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 bg-gray-50">

      {/* Navigation */}
      <div className="flex gap-3 mb-6 justify-center">
        <button
          onClick={handlePrev}
          className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
        >
          →
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT SUBJECT COLUMN */}
        <div className="w-full lg:w-64 bg-white shadow rounded border border-gray-300">
          <div className="bg-blue-600 text-white text-sm font-bold px-4 py-3 rounded-t">
            SUBJECT
          </div>

          {leftFields.map((field) => (
            <div key={field.key} className="border-b border-gray-200 p-3">
              <div className="font-semibold text-sm text-gray-800">
                {field.label}
              </div>
            </div>
          ))}

          <div className="border-b border-gray-200 p-3 font-semibold text-sm text-gray-800">
            Size/Grades
          </div>

          <div className="border-b border-gray-200 p-3 font-semibold text-sm text-gray-800">
            Units/Remarks
          </div>

          {version.sizeBreakups?.map((row, idx) => (
            <div key={idx} className="border-b border-gray-200 p-3">
              <div className="font-semibold text-sm text-gray-900">
                {row.size}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE — NEGOTIATION COLUMNS */}
        <div className="flex gap-6 overflow-x-auto pb-4">

          {history.map((neg, idx) => {
            const isSelected = idx === currentPage;

            return (
              <div
                key={idx}
                className={`w-72 sm:w-80 shrink-0 shadow rounded border border-gray-300 bg-white transition-all ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="bg-blue-600 text-white text-sm font-bold px-4 py-3 text-center rounded-t">
                  {neg.fromParty || "Offer"}
                </div>

                {leftFields.map((field) => {
                  const source = field.source === "offer" ? offer : neg;

                  const value = field.key.toLowerCase().includes("date")
                    ? formatDate(source[field.key])
                    : source[field.key] || "-";

                  return (
                    <div
                      key={field.key}
                      className="border-b border-gray-200 p-3 text-sm text-gray-800"
                    >
                      {value}
                    </div>
                  );
                })}

                <div className="border-b border-gray-200 p-3 text-sm text-gray-800">
                  -
                </div>

                <div className="border-b border-gray-200 p-3 text-sm text-gray-800">
                  {neg.quantity || "-"}
                </div>

                {/* RESPONSIVE SIZEBREAKUP TABLE */}
                <div className="border-b border-gray-200 overflow-x-auto">
                  <div className="min-w-[300px]">

                    {/* Header Row */}
                    <div className="grid grid-cols-4 bg-gray-100 text-[11px] font-semibold border-b border-gray-300 text-gray-700">
                      <div className="py-2 px-1 text-center border-r">
                        Breakup
                        <div className="text-[10px] mt-1 text-gray-500 font-normal">
                          {productMeta.breakupDetails || ""}
                        </div>
                      </div>

                      <div className="py-2 px-1 text-center border-r">
                        Condition
                      </div>

                      <div className="py-2 px-1 text-center border-r">
                        Price
                        <div className="text-[10px] mt-1 text-gray-500 font-normal">
                          {productMeta.priceDetails || ""}
                        </div>
                      </div>

                      <div className="py-2 px-1 text-center">
                        Packing
                      </div>
                    </div>

                    {/* Body Rows */}
                    {neg.sizeBreakups?.map((row, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-4 text-sm border-b border-gray-200"
                      >
                        <div className="py-2 px-1 text-center border-r">
                          {row.breakup}
                        </div>
                        <div className="py-2 px-1 text-center border-r">
                          {row.condition}
                        </div>
                        <div className="py-2 px-1 text-center border-r">
                          {row.price}
                        </div>
                        <div className="py-2 px-1 text-center">
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

      <div className="text-center text-sm mt-4 text-gray-600">
        Version {version.versionNo} of {history.length}
      </div>
    </div>
  );
};

export default Negotiation;
