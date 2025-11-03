import React from "react";

const Header = ({ onBack }) => (
  <div className="flex flex-col gap-4 mb-8">
    <button
      onClick={onBack}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg w-fit text-gray-800 cursor-pointer"
    >
      ← Back
    </button>
    <h1 className="text-3xl font-bold text-gray-900">Create Offer Draft</h1>
    <p className="text-gray-700 text-sm">
      Fill in the details to create a new offer draft.
    </p>
  </div>
);

export default Header;
