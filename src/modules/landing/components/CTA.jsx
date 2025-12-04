import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Building2, Network } from "lucide-react";
import { Users, BarChart, Plug } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();
  const features = [
    {
      title: "Launch Your Business Profile",
      description:
        "Set up your verified business page in minutes and start reaching customers instantly.",
      icon: <Building2 className="h-6 w-6" />,
      bg: "bg-indigo-100",
      color: "text-indigo-600",
    },
    {
      title: "Track Growth & Performance",
      description:
        "Access smart dashboards and analytics to monitor leads, engagement, and conversions in real time.",
      icon: <BarChart3 className="h-6 w-6" />,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Connect & Expand Network",
      description:
        "Collaborate with verified businesses, discover new partners, and grow your presence in the DNB network.",
      icon: <Network className="h-6 w-6" />,
      bg: "bg-sky-100",
      color: "text-sky-600",
    },
  ];

  return (
    <section className=" py-20 text-gray-900 w-full text-center   rounded-lg">
      {/* Heading */}
      <h2 className="text-4xl sm:text-5xl font-bold mb-4">
        Grow Your Business with DNB
      </h2>

      {/* Subheading */}
      <p className="text-lg sm:text-xl mb-12 text-gray-700">
         Create, manage, and promote your business — all from one powerful
        platform built for growth.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <Button  onClick={() => window.location.href = '/' } className="button-styling">
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          className="cursor-pointer border-[#16a34a] text-[#16a34a] px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
        >
          Learn More
        </Button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10 w-full">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-8 border border-gray-100 rounded-2xl shadow-lg
                         transform transition-all duration-500 
                         hover:shadow-blue-500/20 group bg-white"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center ${feature.bg} ${feature.color} rounded-xl mb-6 mx-auto transition-colors duration-300 group-hover:bg-opacity-80`}
            >
              {feature.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>

            <p className="text-base text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Note */}
      <p className="mt-16 text-gray-500 text-sm">
         Build. Manage. Connect. Everything your business needs — all in one
        place with DNB.
      </p>
    </section>
  );
}
