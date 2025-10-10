import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-indigo-600 py-16 text-white text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">
          Ready to elevate your team’s productivity?
        </h2>
        <p className="mb-6 text-lg">
          Sign up today and start managing your projects like a pro.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button
            className="cursor-pointer bg-blue-600 text-white px-8 py-3 text-lg font-medium rounded-lg shadow hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            className="cursor-pointer border-blue-600 text-blue-600 px-8 py-3 text-lg font-medium rounded-lg hover:bg-blue-50 transition-all duration-200"
          >
            Learn More
          </Button>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200">
            <h3 className="font-semibold text-lg mb-2">Collaborate Seamlessly</h3>
            <p className="text-gray-600 text-sm">
              Real-time updates and intuitive workflows keep your team aligned and productive.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200">
            <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Monitor every project with clear dashboards and detailed analytics to make informed decisions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200">
            <h3 className="font-semibold text-lg mb-2">Integrate Easily</h3>
            <p className="text-gray-600 text-sm">
              Connect with the tools your team already uses—simplifying workflows and saving time.
            </p>
          </div>
        </div>

        {/* Optional small note */}
        <p className="mt-12 text-gray-500 text-sm">
          Start your free trial today. No credit card required.
        </p>
      </div>
    </section>
  );
}
