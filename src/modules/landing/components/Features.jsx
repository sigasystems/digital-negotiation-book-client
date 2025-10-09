export default function Features() {
  const features = [
    {
      title: "Fast Setup",
      description:
        "Get your project running in minutes with minimal configuration.",
    },
    {
      title: "Flexible Design",
      description:
        "Reusable components and Tailwind + shadcn make design effortless.",
    },
    {
      title: "Scalable Architecture",
      description:
        "Organized folder structure for long-term growth and maintainability.",
    },
    {
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with built-in collaboration tools.",
    },
    {
      title: "Analytics & Insights",
      description:
        "Track performance and make data-driven decisions easily.",
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-level security to protect your data.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Features
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
