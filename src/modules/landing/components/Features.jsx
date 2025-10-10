import { Bolt, Layout, Server, Users, BarChart, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Fast Setup",
      description: "Get your project running in minutes with minimal configuration.",
      icon: <Bolt className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Flexible Design",
      description: "Reusable components and Tailwind + shadcn make design effortless.",
      icon: <Layout className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Scalable Architecture",
      description: "Organized folder structure for long-term growth and maintainability.",
      icon: <Server className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Real-time Collaboration",
      description: "Work together seamlessly with built-in collaboration tools.",
      icon: <Users className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Analytics & Insights",
      description: "Track performance and make data-driven decisions easily.",
      icon: <BarChart className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-level security to protect your data.",
      icon: <Shield className="h-6 w-6 text-indigo-600" />,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          Features
        </h2>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-white border rounded-xl shadow hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="mr-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
