// import toast from "react-hot-toast";
// import { upgradePlan } from "../services/planService";

// const handlePlanSelect = async (plan, billingCycle ) => {
//   const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const userId = storedUser?.id;
//   const userRole = storedUser?.userRole;

//   // 🧾 User not logged in → redirect to registration / checkout
//   if (!userId) {
//     sessionStorage.setItem(
//       "pendingBusinessData",
//       JSON.stringify({
//         planId: plan.id,
//         planName: plan.name,
//         billingCycle,
//       })
//     );
//     navigate("/checkout", { state: { selectedPlan: plan } });
//     return;
//   }

//   // 💼 Business owner → upgrade / renew
//   if (userRole === "business_owner") {
//     try {
//       toast.loading("Creating payment session...");
//       const res = await upgradePlan({ userId, planId: plan.id, billingCycle });
//       toast.dismiss();

//       if (res?.success && res?.data?.checkoutUrl) {
//         // ✅ Store pending upgrade info
//         sessionStorage.setItem(
//           "pendingBusinessData",
//           JSON.stringify({
//             planId: plan.id,
//             userId,
//             isUpgrade: true,
//             billingCycle,
//             paymentId: res.data.paymentId, // store stripe/payment info
//           })
//         );

//         // Redirect to Stripe checkout
//         window.location.href = res.data.checkoutUrl;
//       } else {
//         toast.error(res?.data?.message || res?.message || "Failed to create payment session.");
//       }
//     } catch (err) {
//       console.error("Upgrade failed:", err);
//       toast.dismiss();
//       toast.error(err?.response?.data?.message || "Upgrade failed. Please try again.");
//     }
//     return;
//   }

//   // 🧩 Normal user → registration flow
//   sessionStorage.setItem(
//     "pendingBusinessData",
//     JSON.stringify({
//       planId: plan.id,
//       planName: plan.name,
//       billingCycle,
//     })
//   );
//   navigate("/register");
// };

// export default handlePlanSelect;

// handlePlanSelect.jsx
import toast from "react-hot-toast";
import { upgradePlan } from "../services/planService";

export const handlePlanSelect = async (plan, navigate, billingCycle = "monthly") => {
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = storedUser?.id;
  const userRole = storedUser?.userRole;

  if (!userId) {
    sessionStorage.setItem(
      "pendingBusinessData",
      JSON.stringify({ planId: plan.id, planName: plan.name, billingCycle })
    );
    navigate("/checkout", { state: { selectedPlan: plan } });
    return;
  }

  if (userRole === "business_owner") {
    try {
      toast.loading("Creating payment session...");
      const res = await upgradePlan({ userId, planId: plan.id, billingCycle });
      toast.dismiss();

      if (res?.success && res?.data?.checkoutUrl) {
        sessionStorage.setItem(
          "pendingBusinessData",
          JSON.stringify({
            planId: plan.id,
            userId,
            isUpgrade: true,
            billingCycle,
            paymentId: res.data.paymentId,
          })
        );
        window.location.href = res.data.checkoutUrl;
      } else {
        toast.error(res?.data?.message || res?.message || "Failed to create payment session.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error(err?.response?.data?.message || "Upgrade failed. Please try again.");
    }
    return;
  }

  // Normal user → registration flow
  sessionStorage.setItem(
    "pendingBusinessData",
    JSON.stringify({ planId: plan.id, planName: plan.name, billingCycle })
  );
  navigate("/register");
};
