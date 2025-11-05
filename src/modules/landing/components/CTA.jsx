import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Users, BarChart, Plug } from "lucide-react";

export default function CTA() {
  const features = [
    {
      title: "Collaborate Seamlessly",
      description:
        "Real-time updates and intuitive workflows keep your team aligned and productive.",
      icon: <Users className="h-6 w-6" />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Track Progress",
      description:
        "Monitor every project with clear dashboards and detailed analytics to make informed decisions.",
      icon: <BarChart className="h-6 w-6" />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Integrate Easily",
      description:
        "Connect with the tools your team already uses—simplifying workflows and saving time.",
      icon: <Plug className="h-6 w-6" />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <section className=" py-20 text-gray-900 w-full text-center   rounded-lg">
      {/* Heading */}
      <h2 className="text-4xl sm:text-5xl font-bold mb-4">
        Take Your Team to the Next Level
      </h2>

      {/* Subheading */}
      <p className="text-lg sm:text-xl mb-12 text-gray-700">
        Join thousands of teams worldwide who are managing projects efficiently
        and collaborating seamlessly.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <Button className="cursor-pointer bg-blue-600 text-white px-8 py-3 text-lg font-medium rounded-lg shadow hover:bg-blue-700 transition-all duration-200 flex items-center justify-center">
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

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10 w-full">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-8 border border-gray-100 rounded-2xl shadow-lg
                         transform transition-all duration-500 ease-in-out hover:scale-[1.02]
                         hover:shadow-blue-500/20 hover:border-blue-500 group bg-white"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center ${feature.bg} ${feature.color} rounded-xl mb-6 mx-auto transition-colors duration-300 group-hover:bg-opacity-80`}
            >
              {feature.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>

            <p className="text-base text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Note */}
      <p className="mt-16 text-gray-500 text-sm">
        Start your free trial today. No credit card required.
      </p>
    </section>
  );
}
