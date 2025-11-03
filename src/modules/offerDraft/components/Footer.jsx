// src/modules/offerDraft/components/Footer.jsx
import React from "react";
import { Spinner } from "@/components/ui/spinner";

const Footer = ({ loading }) => {
  return (
    <div className="px-6 py-6 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3">
      <button
        type="button"
        onClick={() => (window.location.href = "/dashboard")}
        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors"
        title="Return to dashboard without saving"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70 cursor-pointer transition-colors"
        title="Save this offer draft"
      >
        {loading ? (
          <>
            <Spinner className="size-4" /> Saving...
          </>
        ) : (
          "✓ Create Draft"
        )}
      </button>
    </div>
  );
};

export default Footer;
