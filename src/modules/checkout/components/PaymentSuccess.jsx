import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { becomeBusinessOwner } from "../services/paymentService";
import { formatDate, formatTime } from "@/utils/formateDate";
import { PaymentStatusView } from "../utils/statusPayment";
import { setPaymentId, setPaymentStatus } from "@/app/store/slices/paymentSlice";
import { getAllPlans } from "@/modules/landing/services/planService";
import { generateReceiptHTML } from "../utils/sendReceipt";
import { login } from "../../auth/authServices";
import toast from "react-hot-toast";
import useAuth from "@/app/hooks/useAuth";

const CURRENCY_SYMBOL = { INR: "₹", USD: "$", EUR: "€" };

const getNextBillingDate = (cycle) => {
  const now = new Date();
  const next = new Date(now);
  cycle === "yearly"
    ? next.setFullYear(now.getFullYear() + 1)
    : next.setMonth(now.getMonth() + 1);
  return next;
};

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
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const hasRun = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login: setSession } = useAuth();
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };
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

  // 🧾 Print receipt
  const handlePrintReceipt = () => {
    const receiptWindow = window.open("", "_blank");
    const htmlContent = generateReceiptHTML(orderData , formatPrice);
    receiptWindow.document.write(htmlContent);
    receiptWindow.document.close();
    setTimeout(() => receiptWindow.print(), 250);
  };

  // 🚀 Create Business (Normal registration success)
  const handleBusinessCreation = async () => {
    if (hasRun.current) return;
    hasRun.current = true;

    const sessionData = getInitialOrderData();
    const planId = sessionData.planId;
    const billingCycle = sessionData.billingCycle || "monthly";
    const planInfo = availablePlans[planId];

    if (!planInfo) {
      console.warn("Plan info missing for ID:", planId);
      return;
    }

    const now = new Date();
    const nextBillingDate = getNextBillingDate(billingCycle);
    const formattedData = {
      ...sessionData,
      planId,
      billingCycle,
      planName: planInfo.name,
      planPrice:
        billingCycle === "yearly"
          ? planInfo.priceYearly
          : planInfo.priceMonthly,
      currencyCode: planInfo.currency,
      currencySymbol: CURRENCY_SYMBOL[planInfo.currency] || "₹",
      date: formatDate(now),
      time: formatTime(now),
      planStartDate: formatDate(now),
      planEndDate: formatDate(nextBillingDate),
    };

    setOrderData(formattedData);

    try {
      // fake progress
      for (let i = 1; i <= 4; i++) {
        setCurrentStep(i);
        await new Promise((r) => setTimeout(r, 600));
      }

      const res = await becomeBusinessOwner(formattedData);

      if (res?.success && res.data) {
        dispatch(setPaymentId(res.data.paymentId || null));
        dispatch(setPaymentStatus("success"));
        setStatus("success");
        setIsSetupComplete(true);
        toast.success("Payment verified successfully!");
      } else {
        setSetupError(res?.message || "Account creation failed.");
        dispatch(setPaymentStatus("error"));
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setSetupError("Network error. Payment is safe, setup pending.");
      dispatch(setPaymentStatus("error"));
      setStatus("error");
    } finally {
      sessionStorage.setItem("orderData", JSON.stringify(formattedData));
    }
  };

  // ⚙️ Handle Upgrade success
  const handleUpgradeSuccess = async () => {
    try {
      setStatus("processing");
      setCurrentStep(1);

      await new Promise((r) => setTimeout(r, 1000)); // simulate progress

      setCurrentStep(2);
      toast.success("Your plan has been upgraded successfully!");
      setStatus("success");
      setIsSetupComplete(true);
    } catch (err) {
      setSetupError("Error updating plan");
      setStatus("error");
    }
  };
  // 🎯 Decide flow: normal or upgrade
  useEffect(() => {
    const sessionData = getInitialOrderData();
    const isUpgrade = sessionData?.isUpgrade || false;

    if (Object.keys(availablePlans).length) {
      if (isUpgrade) {
        handleUpgradeSuccess(sessionData);
      } else {
        handleBusinessCreation();
      }
    }
  }, [availablePlans]);

  // 🧭 Go to Dashboard after setup
  const handleGoToDashboard = useCallback(async () => {
    try {
      const savedOrder = JSON.parse(sessionStorage.getItem("orderData") || "{}");

      if (!savedOrder?.email || !savedOrder?.password) {
        toast.error("Session expired, please log in manually.");
        navigate("/login");
        return;
      }

      const stored = await login({
        businessName: savedOrder.businessName,
        email: savedOrder.email,
        password: savedOrder.password,
      });

      const { accessToken, refreshToken, tokenPayload } = stored?.data || {};
      if (!accessToken || !tokenPayload) throw new Error("Invalid login response");

      setSession(
        {
          accessToken,
          refreshToken: refreshToken ?? null,
          user: tokenPayload,
        },
        { remember: true }
      );
      sessionStorage.removeItem("pendingBusinessData");

      toast.success(`Welcome, ${tokenPayload.name || "User"}!`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed, please try again.");
    }
  }, [navigate]);

  // 🔙 Return to pricing page
  const handleReturnToPricing = useCallback(() => {
    sessionStorage.removeItem("pendingBusinessData");
    navigate("/");
  }, [navigate]);

  return (
    <PaymentStatusView
      status={status}
      orderData={orderData}
      currentStep={currentStep}
      setupError={setupError}
      handleGoToDashboard={handleGoToDashboard}
      handleReturnToPricing={handleReturnToPricing}
      handlePrintReceipt={handlePrintReceipt}
      isSetupComplete={isSetupComplete}
      formatPrice={(p) =>
        `${orderData.currencySymbol || "₹"}${parseFloat(p || "0").toFixed(2)}`
      }
    />
  );
}
