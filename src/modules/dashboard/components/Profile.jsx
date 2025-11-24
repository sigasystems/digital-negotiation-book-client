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
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
          const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/${paymentId}`);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Profile Data</h3>
            <p className="text-muted-foreground">Unable to load user information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payment = paymentData;
  const plan = paymentData?.Plan;
  const backendUser = paymentData?.User;

  const fullName =
    backendUser
      ? `${backendUser.first_name || ""} ${backendUser.last_name || ""}`.trim()
      : user.name || "User";

  const avatarInitials = fullName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Account Overview</h1>
          <p className="text-muted-foreground">Manage your profile and subscription details</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          {/* ================= PROFILE TAB ================= */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
                      {avatarInitials || "U"}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{fullName || "User"}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {user.accountType || "Standard"}
                      </Badge>
                    </div>
                  </div>

                  {payment?.status && (
                    <Badge
                      variant={payment.status === "success" ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {payment.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField icon={<Mail />} label="Email" value={backendUser?.email} />
                    <InfoField icon={<Phone />} label="Phone Number" value={user.phone} />
                    <InfoField icon={<BriefcaseBusiness />} label="Business Name" value={user.businessName} />
                    <InfoField
                      icon={<Calendar />}
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
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-xl font-semibold text-primary mt-1">
                        {payment.amount}
                        <span className="text-sm text-muted-foreground ml-1">
                          / {plan.billingCycle}
                        </span>
                      </CardDescription>
                    </div>

                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {payment.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      icon={<CreditCard />}
                      label="Payment Method"
                      value={payment.paymentMethod}
                    />
                    <InfoField
                      icon={<Calendar />}
                      label="Subscription Created"
                      value={payment.createdAt}
                    />
                    <InfoField icon={<Package />} label="Billing Cycle" value={plan.billingCycle} />
                    <InfoField icon={<ImportIcon />} label="Stripe Id" value={plan.stripeProductId} />

                  </div>

                  {plan.features?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                </div>
                  )}

                  <div>
                        <h3 className="text-lg font-semibold mb-4">Additional Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <InfoField icon={<LocationEdit />} label="Max Locations" value={plan.maxLocations} />
                                                <InfoField icon={<BringToFront />} label="Max Products" value={plan.maxProducts} />

                                                <InfoField icon={<CombineIcon />} label="Max Offers" value={plan.maxOffers} />

                                                <InfoField icon={<PercentSquareIcon />} label="Max Buyers" value={plan.maxBuyers} />


                        </div>
                      </div>

                  <div className="flex gap-3 pt-4 flex-wrap">
                    <Button className="flex-1 min-w-[200px]">Manage Subscription</Button>
                    <Button variant="outline" className="flex-1 min-w-[200px]">
                      View Invoices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Subscription</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have an active subscription yet.
                  </p>
                  <Button>Browse Plans</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value || "Not provided"}</p>
    </div>
  </div>
);

export default Profile;
