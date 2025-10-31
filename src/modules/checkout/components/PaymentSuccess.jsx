import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { becomeBusinessOwner } from "../services/paymentService";
import { formatDate, formatTime } from "@/utils/formateDate";
import { PaymentStatusView } from "../utils/statusPayment";
import { setPaymentId, setPaymentStatus } from "@/app/store/slices/paymentSlice";
import { getAllPlans } from "@/modules/landing/services/planService";

const CURRENCY_SYMBOL = {
  INR: "₹",
  USD: "$",
  EUR: "€",
};

// 🔹 utility to calculate plan end date
const getNextBillingDate = (cycle) => {
  const now = new Date();
  const next = new Date(now);
  cycle === "yearly"
    ? next.setFullYear(now.getFullYear() + 1)
    : next.setMonth(now.getMonth() + 1);
  return next;
};

// 🔹 initial local data
const getInitialOrderData = () => {
  try {
    const rawData = sessionStorage.getItem("pendingBusinessData");
    return rawData ? JSON.parse(rawData) : {};
  } catch {
    return {};
  }
};

export default function PaymentSuccess() {
  const [status, setStatus] = useState("processing");
  const [orderData, setOrderData] = useState(getInitialOrderData());
  const [availablePlans, setAvailablePlans] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [setupError, setSetupError] = useState(null);
  const hasRun = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 load plan data from backend
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plans = await getAllPlans();
        const planMap = plans.reduce((acc, p) => {
          acc[p.id] = {
            name: p.name,
            priceMonthly: p.priceMonthly,
            priceYearly: p.priceYearly,
            currency: p.currency || "INR",
          };
          return acc;
        }, {});
        setAvailablePlans(planMap);
      } catch (err) {
        console.error("Failed to load plans:", err);
      }
    };
    loadPlans();
  }, []);

  const handleGoToDashboard = useCallback(() => {
    sessionStorage.removeItem("pendingBusinessData");
    sessionStorage.setItem("businessSetupComplete", "true");
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleReturnToPricing = useCallback(() => {
    sessionStorage.removeItem("pendingBusinessData");
    navigate("/");
  }, [navigate]);

  const formatPrice = (price, symbol) =>
    `${symbol}${parseFloat(price || "0").toFixed(2)}`;

  const handlePrintReceipt = () => {
    const w = window.open("", "_blank");
    w.document.write(
      `<h1>Receipt</h1>
       <p>Plan: ${orderData.planName}</p>
       <p>Amount: ${formatPrice(orderData.planPrice, orderData.currencySymbol)}</p>
       <p>Transaction ID: ${orderData.transactionId}</p>
       <p>Valid Till: ${orderData.planEndDate}</p>`
    );
    w.document.close();
    w.print();
  };

  useEffect(() => {
    const handleBusinessCreation = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const sessionData = getInitialOrderData();
      const planId =
        sessionData.planId ||
        Object.keys(availablePlans)[0] ||
        "default-plan-id";
      const billingCycle = sessionData.billingCycle || "monthly";
      const planInfo = availablePlans[planId];

      if (!planInfo) return;

      const now = new Date();
      const nextBillingDate = getNextBillingDate(billingCycle);
      const currencyCode = planInfo.currency || "INR";

      const formattedData = {
        ...sessionData,
        planId,
        billingCycle,
        planName: planInfo.name,
        planPrice:
          billingCycle === "yearly"
            ? planInfo.priceYearly
            : planInfo.priceMonthly,
        currencyCode,
        currencySymbol: CURRENCY_SYMBOL[currencyCode] || "₹",
        date: formatDate(now),
        time: formatTime(now),
        planStartDate: formatDate(now),
        planEndDate: formatDate(nextBillingDate),
        nextBilling: formatDate(nextBillingDate),
      };

      setOrderData(formattedData);

      try {
        // animated fake steps
        for (let i = 1; i <= 4; i++) {
          setCurrentStep(i);
          await new Promise((r) => setTimeout(r, 600));
        }

        const res = await becomeBusinessOwner(formattedData);

        if (res?.success && res.data) {
          dispatch(setPaymentId(res.data.paymentId || null));
          dispatch(setPaymentStatus("success"));

          const existingUser = sessionStorage.getItem("user");
          if (existingUser) {
            try {
              const userObj = JSON.parse(existingUser);
              userObj.userRole = "business_owner";
              if (res.data.userId) userObj.id = res.data.userId;
              sessionStorage.setItem("user", JSON.stringify(userObj));
            } catch (e) {
              console.warn("Failed to update user role:", e);
            }
          }

          sessionStorage.setItem("businessSetupComplete", "true");

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

    if (Object.keys(availablePlans).length) handleBusinessCreation();
  }, [dispatch, availablePlans]);

  return (
    <PaymentStatusView
      status={status}
      orderData={orderData}
      currentStep={currentStep}
      setupError={setupError}
      handleGoToDashboard={handleGoToDashboard}
      handleReturnToPricing={handleReturnToPricing}
      handlePrintReceipt={handlePrintReceipt}
      formatPrice={(price) =>
        formatPrice(price, orderData.currencySymbol || "₹")
      }
    />
  );
}
