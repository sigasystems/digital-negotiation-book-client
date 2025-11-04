import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import PlansPage from "../components/PlansPage";
import { useReloadOncePerSession } from "@/hooks/useReloadOncePerSession";

export default function LandingPage() {
  useReloadOncePerSession("landingPageReloaded")

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <PlansPage/>
    </main>
  );
}
