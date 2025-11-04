import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, LogIn } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12 text-center">
      {/* Error Code */}
      <h1 className="text-7xl sm:text-8xl font-extrabold text-indigo-600 mb-4">
        404
      </h1>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-600 max-w-md mb-8">
        The page you’re looking for doesn’t exist or might have been moved.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium w-full sm:w-auto justify-center"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm font-medium w-full sm:w-auto justify-center"
        >
          <LogIn className="w-4 h-4" />
          Login
        </Link>

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition text-sm font-medium w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
