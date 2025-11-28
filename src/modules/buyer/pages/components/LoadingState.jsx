import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingState = ({ message = "Loading negotiation details..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  </div>
);