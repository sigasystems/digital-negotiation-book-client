import { useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import SelectedPlanCard from "../components/SelectedPlanCard";
import OrderSummary from "../components/OrderSummary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  EyeOff,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  validateCheckoutForm,
  validateSingleField,
} from "../utils/validateCheckoutForm";
import { useCheckUniqueFieldQuery } from "../hooks/checkUniqueFiledQuery";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedPlan = state?.selectedPlan;
  const billingCycle = state?.billingCycle || "monthly";

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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

  // React Query checks for unique fields
  const emailCheck = useCheckUniqueFieldQuery("email", formData.email);
  const businessCheck = useCheckUniqueFieldQuery(
    "businessName",
    formData.businessName,
  );
  const regCheck = useCheckUniqueFieldQuery(
    "registrationNumber",
    formData.registrationNumber,
  );

  // map server error to field errors
  const uniqueErrors = {
    email: emailCheck.data?.exists ? emailCheck.data.message : "",
    businessName: businessCheck.data?.exists ? businessCheck.data.message : "",
    registrationNumber: regCheck.data?.exists ? regCheck.data.message : "",
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!selectedPlan) {
    navigate("/plans");
    return null;
  }

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // local validation
    const fieldError = validateSingleField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formValidationErrors = validateCheckoutForm(formData);
    const combinedErrors = { ...formValidationErrors, ...uniqueErrors };

    setErrors(combinedErrors);

    if (Object.values(combinedErrors).some((err) => err)) {
      toast.error("Please fix the highlighted errors before continuing.");
      return;
    }

    const payload = { planId: selectedPlan.id, billingCycle, ...formData };
    sessionStorage.setItem("pendingBusinessData", JSON.stringify(payload));

    toast.success("Proceeding to payment...");
    navigate("/success");
  };

  const calculateTotal = () =>
    billingCycle === "monthly"
      ? selectedPlan.priceMonthly
      : selectedPlan.priceYearly;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <SelectedPlanCard
              selectedPlan={selectedPlan}
              billingCycle={billingCycle}
            />

            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Enter your personal details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* FIRST NAME / LAST NAME */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="m-1" htmlFor="first_name">
                      First Name *
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="John"
                      className={errors.first_name ? "border-red-500" : ""}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-500">
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="m-1" htmlFor="last_name">
                      Last Name *
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={errors.last_name ? "border-red-500" : ""}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-500">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                {/* EMAIL / PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="m-1" htmlFor="email">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className={
                        errors.email || uniqueErrors.email
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {(errors.email || uniqueErrors.email) && (
                      <p className="text-xs text-red-500">
                        {errors.email || uniqueErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="m-1" htmlFor="phoneNumber">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <Label className="m-1" htmlFor="password">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`${errors.password ? "border-red-500" : ""} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* BUSINESS CARD AND ADDRESS CARDS CONTINUE... (unchanged) */}

            {/* Business Information */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Business Information
                    </CardTitle>
                    <CardDescription>
                      Provide your business details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                  <div>
                    <Label className="m-1" htmlFor="businessName">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Your Business Name"
                      className={
                        errors.businessName || uniqueErrors.businessName
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {(errors.businessName || uniqueErrors.businessName) && (
                      <p className="text-xs text-red-500">
                        {errors.businessName || uniqueErrors.businessName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber" className="m-1">
                      Registration Number *
                    </Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="REG12345"
                      className={
                        errors.registrationNumber ||
                        uniqueErrors.registrationNumber
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {(errors.registrationNumber ||
                      uniqueErrors.registrationNumber) && (
                      <p className="text-xs text-red-500">
                        {errors.registrationNumber ||
                          uniqueErrors.registrationNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="m-1" htmlFor="taxId">
                      Tax ID
                    </Label>
                    <Input
                      id="taxId"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      placeholder="TAX12345"
                    />
                  </div>
                  <div>
                    <Label className="m-1" htmlFor="website">
                      Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Billing Address</CardTitle>
                    <CardDescription>
                      Provide your billing details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address" className="m-1">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="m-1" htmlFor="city">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label className="m-1" htmlFor="state">
                      State *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && (
                      <p className="text-xs text-red-500">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="m-1" htmlFor="country">
                      Country *
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                      className={errors.country ? "border-red-500" : ""}
                    />
                    {errors.country && (
                      <p className="text-xs text-red-500">{errors.country}</p>
                    )}
                  </div>
                  <div>
                    <Label className="m-1" htmlFor="postalCode">
                      Postal Code *
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="400001"
                      className={errors.postalCode ? "border-red-500" : ""}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-red-500">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <OrderSummary
            selectedPlan={selectedPlan}
            billingCycle={billingCycle}
            calculateTotal={calculateTotal}
            formData={formData}
            handleSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}
