import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import PlansPage from "../components/PlansPage";
import Footer from "@/components/layout/Footer";
import { useReloadOncePerSession } from "@/hooks/useReloadOncePerSession";

export default function LandingPage() {
  useReloadOncePerSession("landingPageReloaded");

  return (
    <main className="flex flex-col min-h-screen w-full">
      <Hero />
      <div className="container mx-auto p-4">
      <Features />
      <PlansPage />
      <Testimonials />
      <CTA />
      <Footer />
      </div>
    </main>
  );
}
