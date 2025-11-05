import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import SelectedPlanCard from "../components/SelectedPlanCard";
import OrderSummary from "../components/OrderSummary";
import { InputGroup } from "../utils/InputGroup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, User, Mail, Phone, Building2, MapPin } from "lucide-react";
import { becomeBusinessOwner } from "../services/paymentService";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedPlan = state?.selectedPlan;
  const billingCycle = state?.billingCycle || "monthly";
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

    const handleSubmitfromCheckout = async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setLoading(true);

      try {
        const payload = {
          planId: selectedPlan.id,
          billingCycle,
          ...formData,
        };

        const res = await becomeBusinessOwner(payload);

        if (res.success) {
          navigate("/success");
        } else {
          alert(res.message || "Something went wrong!");
        }
      } catch (err) {
        alert(err);
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
      {/* <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Checkout</h1>
          </div>
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Secure Payment
          </Badge>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">

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
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="first_name"
                        className="text-sm font-medium"
                      >
                        First Name <span className="text-red-500">*</span>
                      </Label>
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

                    <div className="space-y-2">
                      <Label
                        htmlFor="last_name"
                        className="text-sm font-medium"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </Label>
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
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Email Address <span className="text-red-500">*</span>
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

                    <div className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="+1 (555) 000-0000"
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

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      {errors.password && (
                        <p className="text-xs text-red-500">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Business Information */}
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
                  <div className="space-y-2">
                    <Label
                      htmlFor="businessName"
                      className="text-sm font-medium"
                    >
                      Business Name <span className="text-red-500">*</span>
                    </Label>
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="registrationNumber"
                      className="text-sm font-medium"
                    >
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      placeholder="REG-123456"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId" className="text-sm font-medium">
                      Tax ID / VAT Number
                    </Label>
                    <Input
                      id="taxId"
                      name="taxId"
                      placeholder="XX-XXXXXXX"
                      value={formData.taxId}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">
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
                  <Label htmlFor="address" className="text-sm font-medium">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
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
                    <Label htmlFor="city" className="text-sm font-medium">
                      City <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="state" className="text-sm font-medium">
                      State / Province
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-medium">
                      Postal Code
                    </Label>
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
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country <span className="text-red-500">*</span>
                  </Label>
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
