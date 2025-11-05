import { useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
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
import { becomeBusinessOwner } from "../services/paymentService";
import useUniqueBusinessField from "../hooks/useUniqueBusinessFileds";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedPlan = state?.selectedPlan;
  const billingCycle = state?.billingCycle || "monthly";

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const {
    checking,
    errors: uniqueErrors,
    checkUniqueField,
    setErrors: setUniqueErrors,
  } = useUniqueBusinessField();

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

  // Redirect if no plan selected
  if (!selectedPlan) {
    navigate("/plans");
    return null;
  }

  // ✅ Handle field changes with inline validation
  const handleChange = useCallback(
    async (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));

      // Validate single field
      const fieldError = validateSingleField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));

      // Clear unique errors when user starts typing again
      if (uniqueErrors[name]) {
        setUniqueErrors((prev) => ({ ...prev, [name]: "" }));
      }

      // Check uniqueness for specific fields (only if value is not empty and no format error)
      if (
        ["email", "businessName", "registrationNumber"].includes(name) &&
        value.trim() &&
        !fieldError
      ) {
        checkUniqueField(name, value);
      }
    },
    [checkUniqueField, uniqueErrors, setUniqueErrors],
  );

  // ✅ Handle form submission
  const handleSubmitfromCheckout = async (e) => {
    e.preventDefault();

    // Combine validation errors
    const formValidationErrors = validateCheckoutForm(formData);
    const combinedErrors = { ...formValidationErrors, ...uniqueErrors };
    setErrors(combinedErrors);

    // Check if there are any errors
    if (Object.values(combinedErrors).some((err) => err)) {
      toast.error("Please fix the highlighted errors before continuing.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        planId: selectedPlan.id,
        billingCycle,
        ...formData,
      };

      const res = await becomeBusinessOwner(payload);

      if (res.success) {
        toast.success("Checkout successful!");
        navigate("/success");
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <SelectedPlanCard
              selectedPlan={selectedPlan}
              billingCycle={billingCycle}
            />
            {/* Personal Information */}
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
                      Enter your contact details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmitfromCheckout}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={errors.first_name ? "border-red-500" : ""}
                      />
                      {errors.first_name && (
                        <p className="text-xs text-red-500">
                          {errors.first_name}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={errors.last_name ? "border-red-500" : ""}
                      />
                      {errors.last_name && (
                        <p className="text-xs text-red-500">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="9876543210"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                      {errors.phoneNumber && (
                        <p className="text-xs text-red-500">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${
                          errors.password ? "border-red-500" : ""
                        } pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                </form>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Business Information
                    </CardTitle>
                    <CardDescription>
                      Provide your company details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      placeholder="Acme Corporation"
                      value={formData.businessName}
                      onChange={handleChange}
                      className={errors.businessName ? "border-red-500" : ""}
                    />
                    {errors.businessName && (
                      <p className="text-xs text-red-500">
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  {/* Registration Number */}
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      placeholder="REG-123456"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className={uniqueErrors.registrationNumber ? "border-red-500" : ""
                      }
                    />
                    {errors.registrationNumber && (
                      <p className="text-xs text-red-500">
                        {errors.registrationNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                    <Input
                      id="taxId"
                      name="taxId"
                      placeholder="XX-XXXXXXX"
                      value={formData.taxId}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">
                      Website
                      </Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Billing Address</CardTitle>
                    <CardDescription>
                      Where should we send invoices?
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street, Suite 100"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="10001"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
                    className={errors.country ? "border-red-500" : ""}
                  />
                  {errors.country && (
                    <p className="text-xs text-red-500">{errors.country}</p>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>
        {/* Right Column */}
          <OrderSummary
            selectedPlan={selectedPlan}
            billingCycle={billingCycle}
            calculateTotal={calculateTotal}
            formData={formData}
            handleSubmit={handleSubmitfromCheckout} // ✅ add this
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
