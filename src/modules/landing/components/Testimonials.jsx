export default function Testimonials() {
 const testimonials = [
    {
      name: " Eric Sugru",
      role: "Atlas Resturants, US",
      feedback:
        "DNB helped me get my business online within a day. Now customers can find and contact us directly — it’s made a huge difference.",
      avatar: "https://i.pravatar.cc/100?img=15",
    },
    {
      name: "Priya Nair",
      role: "San Pedro Fish Market, US",
      feedback:
        "The dashboard is super easy to use. Managing my listings, payments, and analytics all in one place saves me hours every week.",
      avatar: "https://i.pravatar.cc/100?img=47",
    },
    {
      name: "Larry Plotnick",
      role: "Nordstrom, US",
      feedback:
        "We started with the basic plan and quickly upgraded. DNB’s support team and platform quality are top-notch — highly recommended!",
      avatar: "https://i.pravatar.cc/100?img=23",
    },
  ];

  return (
    <section className="py-20">
      {/* Heading */}
      <h2 className="text-5xl sm:text-5xl font-bold text-center text-gray-900 mb-12">
        What Our Users Say
      </h2>

      {/* Testimonials Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="p-6 bg-white border rounded-xl shadow hover:shadow-xl transition-all duration-300"
          >
            {/* Quote Icon */}
            <div className="text-indigo-600 mb-4 text-3xl">“</div>

            {/* Feedback */}
            <p className="text-gray-700 mb-6 text-sm sm:text-base">
              {t.feedback}
            </p>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              {t.avatar && (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
