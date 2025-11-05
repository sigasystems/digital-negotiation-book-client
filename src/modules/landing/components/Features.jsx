import React from "react";
import {
  Bolt,
  Layout,
  Server,
  Users,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

// The main App component will contain the features section
export default function App() {
  const features = [
    {
      title: "Rapid Deployment",
      description:
        "Get your projects live in record time with a streamlined, zero-config setup process.",
      icon: <Bolt className="h-6 w-6" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Modular Design System",
      description:
        "Utilize flexible, reusable components and the power of Tailwind for effortless, beautiful design.",
      icon: <Layout className="h-6 w-6" />,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      title: "Elastic Scalability",
      description:
        "Built on an organized, scalable architecture ready to handle enterprise-level growth and traffic.",
      icon: <Server className="h-6 w-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Seamless Collaboration",
      description:
        "Work together in real-time with integrated tools designed to boost team productivity and communication.",
      icon: <Users className="h-6 w-6" />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Advanced Analytics",
      description:
        "Gain deep, actionable insights into performance with comprehensive, real-time data visualization.",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      title: "A-Grade Security",
      description:
        "Protect your data with enterprise-level security protocols and continuous reliability monitoring.",
      icon: <ShieldCheck className="h-6 w-6" />,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-50",
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Core Capabilities
          </p>
          <h2 className="text-4xl md:text-5xl  font-bold text-black leading-tight">
            Designed for Modern Digital Teams
          </h2>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale world-class
            applications, all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 md:p-8  border border-gray-100 rounded-2xl shadow-xl
                         transform transition-all duration-500 ease-in-out hover:scale-[1.02]
                         hover:shadow-indigo-500/20 hover:border-indigo-500 group"
            >
              {/* Icon Container */}
              <div
                className={`w-14 h-14 flex items-center justify-center ${feature.bg} ${feature.color} rounded-xl mb-6 flex-shrink-0 transition-colors duration-300 group-hover:bg-opacity-80`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-black mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-base text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
