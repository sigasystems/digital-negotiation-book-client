import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  CheckCircle,
  AlertCircle,
  Loader2,
  PersonStanding,
  BriefcaseBusiness,
  Locate,
  BracketsIcon,
  LocationEdit,
  BringToFront,
  CombineIcon,
  PercentSquareIcon,
  ImportIcon,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const userString = sessionStorage.getItem("user");

        if (!userString) {
          setError("No user data found. Please log in again.");
          setLoading(false);
          return;
        }

        const storedUser = JSON.parse(userString);
        setUser(storedUser);

        const paymentId = storedUser?.paymentId;

        if (paymentId && import.meta?.env?.VITE_API_URL) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/payments/${paymentId}`,
          );

          if (!res.ok) {
            setPaymentData(null);
          } else {
            const response = await res.json();
            setPaymentData(response?.data || null);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-medium text-base sm:text-lg">
            Loading profile details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              No Profile Data
            </h3>
            <p className="text-slate-600">Unable to load user information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payment = paymentData;
  const plan = paymentData?.Plan;
  const backendUser = paymentData?.User;

  const fullName = backendUser
    ? `${backendUser.first_name || ""} ${backendUser.last_name || ""}`.trim()
    : user.name || "User";

  const avatarInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen pb-24 lg:pb-8 px-[24.5px] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="sticky top-17 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm z-20 rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <div className="h-8 w-px bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                    Account Overview
                  </h1>
                  <p className="text-sm text-slate-600">
                    Manage your profile and subscription details
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-8">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>

            {/* ================= PROFILE TAB ================= */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#16a34a] to-green-500 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                        {avatarInitials || "U"}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {fullName || "User"}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="mt-1 bg-indigo-100 text-indigo-700 border-indigo-300"
                        >
                          {user.accountType || "Standard"}
                        </Badge>
                      </div>
                    </div>

                    {payment?.status && (
                      <Badge
                        variant={
                          payment.status === "success" ? "default" : "secondary"
                        }
                        className="flex items-center gap-1 bg-green-50 text-green-700 border-green-300"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {payment.status}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-base sm:text-lg text-slate-900">
                        Personal Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      <InfoField
                        icon={<Mail className="w-4 h-4" />}
                        label="Email"
                        value={backendUser?.email}
                      />
                      <InfoField
                        icon={<Phone className="w-4 h-4" />}
                        label="Phone Number"
                        value={user.phone}
                      />
                      <InfoField
                        icon={<BriefcaseBusiness className="w-4 h-4" />}
                        label="Business Name"
                        value={user.businessName}
                      />
                      <InfoField
                        icon={<Calendar className="w-4 h-4" />}
                        label="Member Since"
                        value={backendUser?.created_at}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ================= SUBSCRIPTION TAB ================= */}
            <TabsContent value="subscription" className="space-y-6">
              {plan ? (
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription className="text-xl text-[#16a34a] font-semibold mt-1">
                          {payment.amount}
                          <span className="text-sm text-slate-600 ml-1">
                            / {plan.billingCycle}
                          </span>
                        </CardDescription>
                      </div>

                      <Badge
                        variant="default"
                        className="flex items-center gap-1 bg-green-50 text-green-700 border-green-300"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {payment.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-base sm:text-lg text-slate-900">
                        Billing Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      <InfoField
                        icon={<CreditCard className="w-4 h-4" />}
                        label="Payment Method"
                        value={payment.paymentMethod}
                      />
                      <InfoField
                        icon={<Calendar className="w-4 h-4" />}
                        label="Subscription Created"
                        value={payment.createdAt}
                      />
                      <InfoField
                        icon={<Package className="w-4 h-4" />}
                        label="Billing Cycle"
                        value={plan.billingCycle}
                      />
                      <InfoField
                        icon={<ImportIcon className="w-4 h-4" />}
                        label="Stripe Id"
                        value={plan.stripeProductId}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="font-semibold text-base sm:text-lg text-slate-900">
                          Additional Features
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        <InfoField
                          icon={<LocationEdit className="w-4 h-4" />}
                          label="Max Locations"
                          value={plan.maxLocations}
                        />
                        <InfoField
                          icon={<BringToFront className="w-4 h-4" />}
                          label="Max Products"
                          value={plan.maxProducts}
                        />
                        <InfoField
                          icon={<CombineIcon className="w-4 h-4" />}
                          label="Max Offers"
                          value={plan.maxOffers}
                        />
                        <InfoField
                          icon={<PercentSquareIcon className="w-4 h-4" />}
                          label="Max Buyers"
                          value={plan.maxBuyers}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 flex-wrap">
                      <Button className="flex-1 min-w-[200px] button-styling">
                        Manage Subscription
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 min-w-[200px] cursor-pointer"
                      >
                        View Invoices
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-slate-200 shadow-sm">
                  <CardContent className="pt-6 text-center py-12">
                    <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-slate-900">
                      No Subscription
                    </h3>
                    <p className="text-slate-600 mb-4">
                      You don't have an active subscription yet.
                    </p>
                    <Button className="cursor-pointer bg-[#16a34a] text-white shadow-md hover:shadow-lg px-4 py-[6px] rounded-lg">
                      Browse Plans
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-sm z-20 mt-10 rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-2 text-green-600">
                <span className="font-medium">All information up to date</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Back
              </Button>

              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="cursor-pointer bg-[#16a34a] text-white shadow-md hover:shadow-lg flex justify-center items-center px-4 py-[6px] rounded-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-slate-600 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-900 truncate">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

export default Profile;
