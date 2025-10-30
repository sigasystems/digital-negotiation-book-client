import { useEffect, useRef } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import PlansPage from "../components/PlansPage";
import { useSelector } from "react-redux";



export default function LandingPage() {
  const hasReloaded = useRef(false);

  useEffect(() => {
    if (hasReloaded.current) return;
    hasReloaded.current = true;

    const alreadyReloaded = sessionStorage.getItem("landingPageReloaded");

    if (!alreadyReloaded) {
      sessionStorage.setItem("landingPageReloaded", "true");
      window.location.replace(window.location.href);
    } else {
      sessionStorage.removeItem("landingPageReloaded");
    }
  }, []);

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
