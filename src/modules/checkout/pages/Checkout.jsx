import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ArrowLeft,
  User,
  Mail,
  Building2,
  MapPin,
} from "lucide-react";
import SelectedPlanCard from "../components/SelectedPlanCard";
import OrderSummary from "../components/OrderSummary";
import { becomeBusinessOwner } from "../services/paymentService";
import useUniqueBusinessField from "../hooks/useUniqueBusinessFileds";
import { validateCheckoutForm, validateSingleField } from "../utils/validateCheckoutForm";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPlan = state?.selectedPlan;
  const billingCycle = state?.billingCycle || "monthly";

  const [loading, setLoading] = useState(false);
  const { checking, errors, setErrors, checkUniqueField } = useUniqueBusinessField();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phoneNumber: "",
    businessName: "",
    registrationNumber: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
    taxId: "",
    website: "",
  });

  if (!selectedPlan) {
    navigate("/plans");
    return null;
  }

 const handleChange = (e) => {
  const { name, value } = e.target;

  // update form data
  setFormData((prev) => ({ ...prev, [name]: value }));

  // run real-time validation
  const fieldError = validateSingleField(name, value);
  setErrors((prev) => ({ ...prev, [name]: fieldError }));

  // check uniqueness only if no validation error
  if (
    !fieldError &&
    ["email", "businessName", "registrationNumber"].includes(name)
  ) {
    checkUniqueField(name, value);
  }
};


  const handleSubmitfromCheckout = async (e) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix all errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const payload = { planId: selectedPlan.id, billingCycle, ...formData };
      const res = await becomeBusinessOwner(payload);

      if (res.success) {
        toast.success("Successfully registered as Business Owner!");
        navigate("/success");
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    } catch {
      toast.error("Server error occurred!");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () =>
    billingCycle === "monthly"
      ? selectedPlan.priceMonthly
      : selectedPlan.priceYearly;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Checkout
            </h1>
          </div>
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Secure Payment
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <SelectedPlanCard selectedPlan={selectedPlan} billingCycle={billingCycle} />

            <FormSection
              title="Personal Information"
              icon={<User className="w-4 h-4 text-indigo-600" />}
              description="Enter your contact details"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWithError label="First Name" name="first_name" {...{ formData, handleChange, errors }} required />
                <InputWithError label="Last Name" name="last_name" {...{ formData, handleChange, errors }} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWithError label="Email Address" name="email" type="email" {...{ formData, handleChange, errors }} loading={checking.email} required />
                <InputWithError label="Phone Number" name="phoneNumber" {...{ formData, handleChange, errors }} required />
              </div>
              <InputWithError label="Password" name="password" type="password" {...{ formData, handleChange, errors }} required />
            </FormSection>

            <FormSection
              title="Business Information"
              icon={<Building2 className="w-4 h-4 text-blue-600" />}
              description="Provide your company details"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWithError label="Business Name" name="businessName" {...{ formData, handleChange, errors }} loading={checking.businessName} required />
                <InputWithError label="Registration Number" name="registrationNumber" {...{ formData, handleChange, errors }} loading={checking.registrationNumber} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWithError label="Tax ID / VAT Number" name="taxId" {...{ formData, handleChange, errors }} />
                <InputWithError label="Website" name="website" {...{ formData, handleChange, errors }} />
              </div>
            </FormSection>

            <FormSection
              title="Billing Address"
              icon={<MapPin className="w-4 h-4 text-green-600" />}
              description="Where should we send invoices?"
            >
              <InputWithError label="Street Address" name="address" {...{ formData, handleChange, errors }} required />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputWithError label="City" name="city" {...{ formData, handleChange, errors }} required />
                <InputWithError label="State / Province" name="state" {...{ formData, handleChange, errors }} />
                <InputWithError label="Postal Code" name="postalCode" {...{ formData, handleChange, errors }} />
              </div>
              <InputWithError label="Country" name="country" {...{ formData, handleChange, errors }} required />
            </FormSection>
          </div>

          <OrderSummary
            selectedPlan={selectedPlan}
            billingCycle={billingCycle}
            calculateTotal={calculateTotal}
            formData={formData}
            handleSubmit={handleSubmitfromCheckout}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

function FormSection({ title, icon, description, children }) {
  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function InputWithError({ label, name, formData, handleChange, errors, required, type = "text", loading }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleChange}
          className={`${errors[name] ? "border-red-500" : ""} pr-10`}
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
    </div>
  );
}
