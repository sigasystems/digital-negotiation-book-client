import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { becomeBusinessOwner } from "../services/paymentService";
import { formatDate, formatTime } from "@/utils/formateDate";
import { PaymentStatusView } from "../utils/statusPayment";
import { useDispatch } from "react-redux";
import { setPaymentId, setPaymentStatus } from "@/app/store/slices/paymentSlice";


const CURRENCY_SYMBOL = {
    "INR": "₹",
    "USD": "$",
    "EUR": "€"
};

const MOCK_PLAN_PRICES = {
    // Pro Plan (Yearly: 2999, Monthly: 299)
    "745c7918-8b87-4498-ba8a-27f2eb98bfc8": { name: "Pro", priceMonthly: "299.00", priceYearly: "2999.00", currency: "INR" },
    // Basic Plan (Yearly: 1999, Monthly: 199) - Defaulted in current getInitialOrderData
    "d1d98dd8-779e-4777-9ca7-19a1413ac78d": { name: "Basic", priceMonthly: "199.00", priceYearly: "1999.00", currency: "INR" },
};

const getInitialOrderData = () => {
    try {
        const rawData = sessionStorage.getItem("pendingBusinessData");
        const parsedData = rawData ? JSON.parse(rawData) : {};
        
        const planId = parsedData.planId || 'd1d98dd8-779e-4777-9ca7-19a1413ac78d';
        const billingCycle = parsedData.billingCycle || 'monthly';
        
        const planDetails = MOCK_PLAN_PRICES[planId] || MOCK_PLAN_PRICES['d1d98dd8-779e-4777-9ca7-19a1413ac78d'];
        const mockPriceKey = billingCycle === 'yearly' ? 'priceYearly' : 'priceMonthly';
        
        // This ensures the processing/error screen shows the expected charged amount
        const initialPrice = planDetails[mockPriceKey] || '199.00'; 
        const currencyCode = planDetails.currency || 'INR';

        return {
            businessName: parsedData.businessName || 'Your Business',
            email: parsedData.email || 'user@example.com',
            planId: planId,
            billingCycle: billingCycle,
            
            // Initial price and plan set from mock data
            planName: planDetails.name || 'Basic Plan',
            planPrice: initialPrice, 
            total: initialPrice,
            currencySymbol: CURRENCY_SYMBOL[currencyCode] || '₹', 
            currencyCode: currencyCode,
            
            // Mocked/Placeholder payment details
            cardLast4: '1234', 
            cardType: 'Visa', 
            transactionId: 'TXN-9876543210', 
            invoicePdf: null, // Initialize invoicePdf to null
            
            ...parsedData, // Merge all other form data
        };
    } catch (error) {
        console.error("Failed to parse session storage data:", error);
        return {};
    }
};

export default function PaymentSuccess() {
  const [status, setStatus] = useState("processing");
  const [orderData, setOrderData] = useState(getInitialOrderData());
  const [currentStep, setCurrentStep] = useState(0);
  const [setupError, setSetupError] = useState(null);
  const hasRun = useRef(false);
  const navigate = useNavigate();

  const handleGoToDashboard = useCallback(() => {
    sessionStorage.removeItem("pendingBusinessData");
    navigate("/dashboard");
  }, [navigate]);

  const handleReturnToPricing = useCallback(() => {
    sessionStorage.removeItem("pendingBusinessData");
    navigate("/");
  }, [navigate]);

  const formatPrice = (price) => `${orderData.currencySymbol}${parseFloat(price || "0").toFixed(2)}`; 

  const handlePrintReceipt = () => {
    const w = window.open("", "_blank");
    w.document.write(`<h1>Receipt</h1><p>Total: ${formatPrice(orderData.planPrice)}</p>`);
    w.document.close();
    w.print();
  };

  // useEffect(() => {
  //   const handleBusinessCreation = async () => {
  //     if (hasRun.current) return;
  //     hasRun.current = true;

  //     const sessionData = getInitialOrderData();
  //     const now = new Date();
  //     const nextBillingDate = new Date(now);
  //     sessionData.billingCycle === "yearly"
  //       ? nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
  //       : nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  //     setOrderData((prev) => ({
  //       ...prev,
  //       ...sessionData,
  //       nextBilling: formatDate(nextBillingDate),
  //       time: formatTime(now),
  //       date: formatDate(now),
  //     }));

  //     try {
  //       for (let i = 1; i <= 4; i++) {
  //         setCurrentStep(i);
  //         await new Promise((r) => setTimeout(r, 600));
  //       }

  //       const res = await becomeBusinessOwner(sessionData);
  //       if (res?.success && res.data) {
  //         setOrderData((prev) => ({
  //           ...prev,
  //           planPrice: res.data.plan?.price || prev.planPrice,
  //           transactionId: res.data.transactionId || prev.transactionId,
  //         }));
  //         setStatus("success");
  //       } else {
  //         setSetupError(res?.message || "Account creation failed.");
  //         setStatus("error");
  //       }
  //     } catch {
  //       setSetupError("Network error. Payment is safe, setup pending.");
  //       setStatus("error");
  //     }
  //   };

  //   handleBusinessCreation();
  // }, []);


  const dispatch = useDispatch();

useEffect(() => {
  const handleBusinessCreation = async () => {
    if (hasRun.current) return;
    hasRun.current = true;

    const sessionData = getInitialOrderData();
    const now = new Date();
    const nextBillingDate = new Date(now);
    sessionData.billingCycle === "yearly"
      ? nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
      : nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    setOrderData((prev) => ({
      ...prev,
      ...sessionData,
      nextBilling: formatDate(nextBillingDate),
      time: formatTime(now),
      date: formatDate(now),
    }));

    try {
      for (let i = 1; i <= 4; i++) {
        setCurrentStep(i);
        await new Promise((r) => setTimeout(r, 600));
      }

      const res = await becomeBusinessOwner(sessionData);
      if (res?.success && res.data) {
        dispatch(setPaymentId(res.data.paymentId || null)); // 👈 store in Redux
        dispatch(setPaymentStatus("success"));

        setOrderData((prev) => ({
          ...prev,
          planPrice: res.data.plan?.price || prev.planPrice,
          transactionId: res.data.transactionId || prev.transactionId,
        }));
        setStatus("success");
      } else {
        setSetupError(res?.message || "Account creation failed.");
        dispatch(setPaymentStatus("error"));
        setStatus("error");
      }
    } catch {
      setSetupError("Network error. Payment is safe, setup pending.");
      dispatch(setPaymentStatus("error"));
      setStatus("error");
    }
  };

  handleBusinessCreation();
}, [dispatch]);

  return (
    <PaymentStatusView
      status={status}
      orderData={orderData}
      currentStep={currentStep}
      setupError={setupError}
      handleGoToDashboard={handleGoToDashboard}
      handleReturnToPricing={handleReturnToPricing}
      handlePrintReceipt={handlePrintReceipt}
      formatPrice={formatPrice}
    />
  );
}                             





