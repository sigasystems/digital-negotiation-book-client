import React from "react";
import { Bolt, Layout, Server, Users, BarChart3, ShieldCheck } from "lucide-react";

export default function App() {
  const features = [
    {
      title: "Rapid Deployment",
      description: "Deploy your projects quickly with a zero-config setup and streamlined workflow.",
      icon: <Bolt className="h-6 w-6" />,
    },
    {
      title: "Modular Design System",
      description: "Flexible, reusable components for consistent and scalable designs.",
      icon: <Layout className="h-6 w-6" />,
    },
    {
      title: "Elastic Scalability",
      description: "Architecture designed to grow with your business, handling enterprise-level traffic.",
      icon: <Server className="h-6 w-6" />,
    },
    {
      title: "Seamless Collaboration",
      description: "Real-time collaboration tools to boost productivity and team efficiency.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Advanced Analytics",
      description: "Gain actionable insights from performance data with elegant visualizations.",
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      title: "Enterprise Security",
      description: "Keep your data safe with robust security protocols and reliability monitoring.",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
  ];

  return (
    <section className="min-h-screen py-24 font-sans bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Core Capabilities
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Designed for Modern Digital Teams
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale world-class applications, all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm
                         transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-700 rounded-xl mb-6">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
