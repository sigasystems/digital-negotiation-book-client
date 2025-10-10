import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import EmailForm from "./EmailForm";
import OtpAndPasswordForm from "./OtpAndPasswordForm";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100 px-8 md:px-16 py-12">
        <div className="w-full max-w-md">
          {!isOtpSent ? (
            <EmailForm
              setIsOtpSent={setIsOtpSent}
              setEmail={setEmail}
            />
          ) : (
            <OtpAndPasswordForm
              email={email}
              navigate={navigate}
            />
          )}
        </div>
      </div>

      <div className="w-full md:w-1/2 h-64 md:h-auto">
        <img
          src="/src/assets/loginimage.webp"
          alt="Forgot Password Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
