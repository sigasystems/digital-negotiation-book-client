export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      feedback:
        "This platform completely transformed the way our team works. Highly recommended!",
    },
    {
      name: "Michael Lee",
      role: "Developer",
      feedback:
        "Clean, intuitive, and scalable. Everything a modern web app should be.",
    },
    {
      name: "Emma Watson",
      role: "Designer",
      feedback:
        "I love how flexible the components are. Saved us weeks of design time.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Users Say
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 bg-white border rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="text-gray-600 mb-4">"{t.feedback}"</p>
              <p className="font-semibold text-gray-900">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
