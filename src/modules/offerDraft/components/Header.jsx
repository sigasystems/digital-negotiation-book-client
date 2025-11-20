import React from "react";

const Header = ({ onBack }) => (
  <div className="flex flex-col">
    <button
      onClick={onBack}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg w-fit text-gray-800 cursor-pointer"
    >
      ← Back
    </button>
  </div>
);

export default Header;
