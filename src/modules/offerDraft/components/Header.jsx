import React from "react";

const Header = ({ onBack }) => (
  <div className="flex flex-col">
    <button
      onClick={onBack}
      className="px-4 hover:bg-gray-200 w-fit text-gray-800 cursor-pointer"
    >
      ← Back
    </button>
  </div>
);

export default Header;
