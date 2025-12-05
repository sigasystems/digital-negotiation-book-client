import React from "react";
import { Button } from "@/components/ui/button";
import { History, ArrowLeft } from "lucide-react";

export const ErrorState = ({ error, onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-red-100">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <History className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
      <p className="text-slate-600 mb-6">{error}</p>
      <Button
        onClick={onBack}
        className="flex items-center gap-2 bg-[#16a34a] hover:bg-green-700 text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Previous
      </Button>
    </div>
  </div>
);