import React, { useEffect, useState, useMemo } from "react";
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

  // Helper function for date comparison
  const formatDateForComparison = (date) => {
    if (!date) return null;
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return null;
    }
  };

  // Simplified change detection
  const getChangedFields = useMemo(() => {
    if (!negotiation?.history?.length) return {};

    const changes = {};
    const history = negotiation.history;

    for (let i = 1; i < history.length; i++) {
      const current = history[i];
      const previous = history[i - 1];
      const versionChanges = new Set();

      // Compare left fields
      const leftFieldsKeys = [
        "offerName", "createdAt", "fromParty", "toParty", 
        "offerValidityDate", "shipmentDate", "processor", 
        "plantApprovalNumber", "brand", "origin", "destination", 
        "productName", "speciesName", "quantity", "packing"
      ];

      leftFieldsKeys.forEach(key => {
        let currentVal = current[key];
        let previousVal = previous[key];
        
        if (key.toLowerCase().includes('date')) {
          currentVal = formatDateForComparison(currentVal);
          previousVal = formatDateForComparison(previousVal);
        }
        
        if (currentVal !== previousVal) {
          versionChanges.add(key);
        }
      });

      // Compare sizeBreakups
      if (current.sizeBreakups && previous.sizeBreakups) {
        const maxRows = Math.max(current.sizeBreakups.length, previous.sizeBreakups.length);
        
        for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
          const currentRow = current.sizeBreakups[rowIndex];
          const previousRow = previous.sizeBreakups[rowIndex];
          
          if (!previousRow && currentRow) {
            // New row added
            versionChanges.add(`breakup_${rowIndex}_added`);
            versionChanges.add(`condition_${rowIndex}_added`);
            versionChanges.add(`price_${rowIndex}_added`);
          } else if (previousRow && !currentRow) {
            // Row removed
            versionChanges.add(`breakup_${rowIndex}_removed`);
            versionChanges.add(`condition_${rowIndex}_removed`);
            versionChanges.add(`price_${rowIndex}_removed`);
          } else if (previousRow && currentRow) {
            // Check each field for changes
            if (currentRow.breakup !== previousRow.breakup) {
              versionChanges.add(`breakup_${rowIndex}_changed`);
            }
            if (currentRow.condition !== previousRow.condition) {
              versionChanges.add(`condition_${rowIndex}_changed`);
            }
            if (currentRow.price !== previousRow.price) {
              versionChanges.add(`price_${rowIndex}_changed`);
            }
          }
        }
      } else if (current.sizeBreakups && !previous.sizeBreakups) {
        // All rows are new in this version
        current.sizeBreakups.forEach((row, rowIndex) => {
          versionChanges.add(`breakup_${rowIndex}_added`);
          versionChanges.add(`condition_${rowIndex}_added`);
          versionChanges.add(`price_${rowIndex}_added`);
        });
      } else if (!current.sizeBreakups && previous.sizeBreakups) {
        // All rows removed in this version
        previous.sizeBreakups.forEach((row, rowIndex) => {
          versionChanges.add(`breakup_${rowIndex}_removed`);
          versionChanges.add(`condition_${rowIndex}_removed`);
          versionChanges.add(`price_${rowIndex}_removed`);
        });
      }

      changes[i] = versionChanges;
    }

    return changes;
  }, [negotiation]);

  // Check if a field has changed
  const isFieldChanged = (versionIndex, fieldKey, rowIndex = null) => {
    const fieldId = rowIndex !== null ? 
      `${fieldKey}_${rowIndex}_changed` : 
      fieldKey;
    return getChangedFields[versionIndex]?.has(fieldId) || false;
  };

  // Check if a field was added
  const isFieldAdded = (versionIndex, fieldKey, rowIndex = null) => {
    const fieldId = rowIndex !== null ? 
      `${fieldKey}_${rowIndex}_added` : 
      `${fieldKey}_added`;
    return getChangedFields[versionIndex]?.has(fieldId) || false;
  };

  // Check if a field was removed
  const isFieldRemoved = (versionIndex, fieldKey, rowIndex = null) => {
    const fieldId = rowIndex !== null ? 
      `${fieldKey}_${rowIndex}_removed` : 
      `${fieldKey}_removed`;
    return getChangedFields[versionIndex]?.has(fieldId) || false;
  };

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
          confirmButtonColor: "bg-[#16a34a] hover:bg-green-700"
        };
    }
  };

  const modalContent = getModalContent();

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", date, error);
      return "-";
    }
  };

  const handlePrev = () =>
    setCurrentPage((p) => (p > 0 ? p - 1 : history.length - 1));

  const handleNext = () =>
    setCurrentPage((p) => (p < history.length - 1 ? p + 1 : 0));

  const handleNegotiate = () => {
    navigate(`/latest-negotiation/${id}`);
  };

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
  const isOfferEditable = offer?.status?.toLowerCase() === "open" || offer?.status?.toLowerCase() === "close";

  const leftFields = [
    { label: "Offer Name", key: "offerName" },
    { label: "Offer Date", key: "createdAt" },
    { label: "From Name", key: "fromParty" },
    { label: "To Party", key: "toParty" },
    { label: "Offer Validity", key: "offerValidityDate" },
    { label: "Shipment Date", key: "shipmentDate" },
    { label: "Processor", key: "processor" },
    { label: "Plant Approval", key: "plantApprovalNumber" },
    { label: "Brand", key: "brand" },
    { label: "Origin", key: "origin" },
    { label: "Destination", key: "destination" },
    { label: "Product", key: "productName" },
    { label: "Species", key: "speciesName" },
    { label: "Quantity", key: "quantity" },
    { label: "Packing", key: "packing" },
  ];

  // Get change count for a version
  const getChangeCount = (versionIndex) => {
    if (versionIndex === 0) return 0;
    return getChangedFields[versionIndex]?.size || 0;
  };

  return (
    <>
      <div className="px-8 py-3">
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
            
            <div className="button-styling cursor-none">
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
              disabled={!isOfferEditable}
              className={`px-5 py-2 text-white text-sm font-medium rounded-md shadow-sm transition-colors ${
                isOfferEditable 
                  ? "bg-[#0ea5e9] hover:bg-[#0b84ba] cursor-pointer" 
                  : "bg-[#3ec6ff] cursor-not-allowed"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm
              </span>
            </button>

            <button
              onClick={() => handleRespond("reject")}
              disabled={!isOfferEditable}
              className={`px-5 py-2 text-white text-sm font-medium rounded-md shadow-sm transition-colors ${
                isOfferEditable 
                  ? "bg-rose-600 hover:bg-rose-700 cursor-pointer" 
                  : "bg-rose-400 cursor-not-allowed"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Withdraw
              </span>
            </button>

            <button
              onClick={handleNegotiate}
              disabled={!isOfferEditable}
              className={`px-5 py-2 text-white text-sm font-medium rounded-md shadow-sm transition-colors ${
                isOfferEditable 
                  ? "button-styling" 
                  : "bg-blue-400 cursor-not-allowed"
              }`}
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
        <div className="h-full px-8 py-4">
          <div
            className="grid gap-3 h-full"
            style={{
              gridTemplateColumns: `220px repeat(${history.length}, 360px)`,
            }}
          >
            {/* Left static column */}
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
                    {row.size || "-"}
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic columns for each version */}
            {history.map((neg, idx) => {
              const selected = idx === currentPage;
              const isLastColumn = idx === history.length - 1;
              const changeCount = getChangeCount(idx);
              
              let columnHeader = neg.fromParty || "Offer";
              let headerBgColor = selected ? "bg-[#16a34a]" : "bg-gray-700";
              
              if (isLastColumn && !isOfferEditable && offer?.status) {
                columnHeader = offer.status.toUpperCase();
                headerBgColor = selected ? "bg-amber-600" : "bg-amber-700";
              }

              return (
                <div
                  key={idx}
                  className={`rounded-lg overflow-hidden transition-all duration-200 flex flex-col shadow-sm ${
                    selected
                      ? "bg-white border-2 border-[#16a34a] shadow-lg"
                      : "bg-white border border-gray-200"
                  }`}
                >                
                  {/* Column Header with Change Indicator */}
                  <div className={`px-4 py-2.5 text-center text-white font-semibold text-xs shrink-0 ${headerBgColor} relative`}> 
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className={`truncate ${isLastColumn && !isOfferEditable && offer?.status ? "font-bold" : ""}`}>
                        {columnHeader}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {/* Left Fields with Change Highlighting */}
                    {leftFields.map((field, fieldIdx) => {
                      let val;
                      
                      if (field.key === "processor" || field.key === "origin" || field.key === "destination" || field.key === "offerValidityDate") {
                        const rawValue = offer[field.key];
                        val = field.key.toLowerCase().includes("date") ? formatDate(rawValue) : rawValue || "-";
                      } else if (field.key === "createdAt") {
                        val = formatDate(neg[field.key]);
                      } else if (field.key.toLowerCase().includes("date")) {
                        val = formatDate(neg[field.key]);
                      } else if (field.key === "packing") {
                        val = productMeta.packing || "-";
                      } else {
                        val = neg[field.key] || "-";
                      }

                      const added = isFieldAdded(idx, field.key);
                      const changed = isFieldChanged(idx, field.key);
                      const removed = isFieldRemoved(idx, field.key);

                      // Simple text highlighting without background changes
                      let textClass = "text-gray-800";
                      let indicator = null;

                      if (added) {
                        textClass = "text-green-600 font-semibold";
                        indicator = (
                          <span className="inline-block w-3 h-3 ml-1">
                            {/* <svg viewBox="0 0 12 12" fill="currentColor" className="text-green-600">
                              <path d="M6 0a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H7v4a1 1 0 1 1-2 0V7H1a1 1 0 1 1 0-2h4V1a1 1 0 0 1 1-1z"/>
                            </svg> */}
                          </span>
                        );
                      } else if (removed) {
                        textClass = "text-red-500 line-through";
                        indicator = (
                          <span className="inline-block w-3 h-3 ml-1">
                            {/* <svg viewBox="0 0 12 12" fill="currentColor" className="text-red-500">
                              <path d="M1 6a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1z"/>
                            </svg> */}
                          </span>
                        );
                      } else if (changed) {
                        textClass = "text-blue-600 font-semibold";
                        indicator = (
                          <span className="inline-block w-3 h-3 ml-1">
                            {/* <svg viewBox="0 0 12 12" fill="currentColor" className="text-blue-600">
                              <path d="M11.707 1.293a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-1-1a1 1 0 1 1 1.414-1.414L2 10.586 10.293 2.293a1 1 0 0 1 1.414 0z"/>
                            </svg> */}
                          </span>
                        );
                      }

                      return (
                        <div
                          key={field.key}
                          className={`px-4 py-2 text-[11px] font-medium border-b border-gray-200 truncate ${
                            fieldIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <div className={`flex items-center ${textClass}`}>
                            {val}
                            {indicator}
                          </div>
                        </div>
                      );
                    })}

                    {/* Size Breakups Header */}
                    <div className="grid grid-cols-3 bg-gray-50 text-[10px] font-bold border-b border-gray-200 text-gray-700">
                      <div className="px-4 py-2 text-center border-r border-gray-200">
                        Breakup
                      </div>
                      <div className="px-4 py-2 text-center border-r border-gray-200">
                        Condition
                      </div>
                      <div className="px-4 py-2 text-center">
                        Price
                      </div>
                    </div>

                    {/* Product Meta Row */}
                    <div className="grid grid-cols-3 bg-white text-[10px] font-semibold border-b border-gray-200 text-gray-700">
                      <div className="px-4 py-2 text-center border-r border-gray-200">
                        {productMeta.breakupDetails || ""}
                      </div>
                      <div className="px-4 py-2 text-center border-r border-gray-200">
                      </div>
                      <div className="px-4 py-2 text-center">
                        {productMeta.priceDetails || ""}
                      </div>
                    </div>

                    {/* Size Breakups with Change Highlighting */}
                    {neg.sizeBreakups?.map((row, i) => {
                      const breakupAdded = isFieldAdded(idx, 'breakup', i);
                      const breakupChanged = isFieldChanged(idx, 'breakup', i);
                      const breakupRemoved = isFieldRemoved(idx, 'breakup', i);
                      
                      const conditionAdded = isFieldAdded(idx, 'condition', i);
                      const conditionChanged = isFieldChanged(idx, 'condition', i);
                      const conditionRemoved = isFieldRemoved(idx, 'condition', i);
                      
                      const priceAdded = isFieldAdded(idx, 'price', i);
                      const priceChanged = isFieldChanged(idx, 'price', i);
                      const priceRemoved = isFieldRemoved(idx, 'price', i);

                      // Entire row removed
                      if (breakupRemoved && conditionRemoved && priceRemoved) {
                        return null; // Don't show removed rows
                      }

                      const getTextClass = (isAdded, isChanged, isRemoved) => {
                        if (isAdded) return "text-green-600 font-semibold";
                        if (isRemoved) return "text-red-500 line-through";
                        if (isChanged) return "text-blue-600 font-semibold";
                        return "text-gray-700";
                      };

                      const getIndicator = (isAdded, isChanged, isRemoved) => {
                        if (isAdded) return "text-green-600";
                        if (isRemoved) return "text-red-500";
                        if (isChanged) return "text-blue-600";
                        return null;
                      };

                      return (
                        <div
                          key={i}
                          className={`grid grid-cols-3 text-[11px] border-b border-gray-200 ${
                            i % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          {/* Breakup Column */}
                          <div className="px-4 py-2 text-center border-r border-gray-200 truncate">
                            <div className={`flex items-center justify-center ${getTextClass(breakupAdded, breakupChanged, breakupRemoved)}`}>
                              {row.breakup || "-"}
                              {getIndicator(breakupAdded, breakupChanged, breakupRemoved) && (
                                <span className="inline-block w-3 h-3 ml-1">
                                  {/* <svg viewBox="0 0 12 12" fill="currentColor" className={getIndicator(breakupAdded, breakupChanged, breakupRemoved)}>
                                    {breakupAdded && <path d="M6 0a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H7v4a1 1 0 1 1-2 0V7H1a1 1 0 1 1 0-2h4V1a1 1 0 0 1 1-1z"/>}
                                    {breakupRemoved && <path d="M1 6a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1z"/>}
                                    {breakupChanged && <path d="M11.707 1.293a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-1-1a1 1 0 1 1 1.414-1.414L2 10.586 10.293 2.293a1 1 0 0 1 1.414 0z"/>}
                                  </svg> */}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Condition Column */}
                          <div className="px-4 py-2 text-center border-r border-gray-200 truncate">
                            <div className={`flex items-center justify-center ${getTextClass(conditionAdded, conditionChanged, conditionRemoved)}`}>
                              {row.condition || "-"}
                              {getIndicator(conditionAdded, conditionChanged, conditionRemoved) && (
                                <span className="inline-block w-3 h-3 ml-1">
                                  {/* <svg viewBox="0 0 12 12" fill="currentColor" className={getIndicator(conditionAdded, conditionChanged, conditionRemoved)}>
                                    {conditionAdded && <path d="M6 0a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H7v4a1 1 0 1 1-2 0V7H1a1 1 0 1 1 0-2h4V1a1 1 0 0 1 1-1z"/>}
                                    {conditionRemoved && <path d="M1 6a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1z"/>}
                                    {conditionChanged && <path d="M11.707 1.293a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-1-1a1 1 0 1 1 1.414-1.414L2 10.586 10.293 2.293a1 1 0 0 1 1.414 0z"/>}
                                  </svg> */}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price Column */}
                          <div className="px-4 py-2 text-center truncate">
                            <div className={`flex items-center justify-center font-semibold ${
                              priceAdded ? "text-green-700" :
                              priceRemoved ? "text-red-500 line-through" :
                              priceChanged ? "text-blue-700" :
                              "text-emerald-600"
                            }`}>
                              {row.price || "-"}
                              {getIndicator(priceAdded, priceChanged, priceRemoved) && (
                                <span className="inline-block w-3 h-3 ml-1">
                                  {/* <svg viewBox="0 0 12 12" fill="currentColor" className={getIndicator(priceAdded, priceChanged, priceRemoved)}>
                                    {priceAdded && <path d="M6 0a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H7v4a1 1 0 1 1-2 0V7H1a1 1 0 1 1 0-2h4V1a1 1 0 0 1 1-1z"/>}
                                    {priceRemoved && <path d="M1 6a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1z"/>}
                                    {priceChanged && <path d="M11.707 1.293a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-1-1a1 1 0 1 1 1.414-1.414L2 10.586 10.293 2.293a1 1 0 0 1 1.414 0z"/>}
                                  </svg> */}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
    </>
  );
};

export default Negotiation;