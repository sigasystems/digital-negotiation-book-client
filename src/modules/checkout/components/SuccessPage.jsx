import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-gray-700 mb-6">Thank you for subscribing to our service.</p>
      <Button onClick={() => navigate("/plans")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
        Go Back to Plans
      </Button>
    </div>
  );
}
