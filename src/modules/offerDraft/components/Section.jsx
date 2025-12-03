import React from "react";

const Section = ({ title, children }) => (
  <div className="px-6 py-2 border-b border-gray-200">
    <h2 className="text-xl font-bold mb-6 text-gray-900">{title}</h2>
    {children}
  </div>
);

export default Section;
