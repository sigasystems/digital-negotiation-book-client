import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, Tag, Users, DollarSign, MapPin, Calendar, Truck } from "lucide-react";

export const OfferSummary = ({ offer }) => {
  if (!offer) return null;

  return (
    <Card className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow pt-4">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b p-4">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Building className="w-5 h-5 text-blue-600" />
          Offer Summary
        </CardTitle>
        <CardDescription>Original offer details and specifications</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryItem icon={Tag} label="Offer Name" value={offer.offerName} isBold />
          <SummaryItem icon={Users} label="From Party" value={offer.fromParty} />
          <SummaryItem icon={Users} label="To Party" value={offer.toParty} />
          <SummaryItem 
            icon={DollarSign} 
            label="Grand Total" 
            value={offer.grandTotal} 
            isBold 
            isGreen 
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryItem 
            icon={MapPin} 
            label="Origin & Destination" 
            value={`${offer.origin} → ${offer.destination}`} 
          />
          <SummaryItem 
            icon={Calendar} 
            label="Validity Date" 
            value={offer.offerValidityDate?.split("T")[0] || '-'} 
          />
          <SummaryItem 
            icon={Truck} 
            label="Shipment Date" 
            value={offer.shipmentDate?.split("T")[0] || '-'} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

const SummaryItem = ({ icon: Icon, label, value, isBold = false, isGreen = false }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    <p className={`text-sm ${isBold ? 'font-semibold' : ''} ${isGreen ? 'text-green-600' : 'text-slate-900'}`}>
      {value}
    </p>
  </div>
);