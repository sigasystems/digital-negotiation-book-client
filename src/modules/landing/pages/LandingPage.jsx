import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Navbar from "@/components/layout/Navbar";
import PlansPage from "../components/Plan";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <PlansPage/>
      <Footer />
    </div>
  );
}
