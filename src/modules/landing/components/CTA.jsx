import { Button } from "@/components/ui/button";

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
        <Button className="bg-white text-indigo-600 px-8 py-3 text-lg hover:bg-gray-100">
          Get Started
        </Button>
      </div>
    </section>
  );
}
