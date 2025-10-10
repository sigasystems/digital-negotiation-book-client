import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../../../components/layout/Footer";
import PlansPage from "../components/PlansPage";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <PlansPage/>
      <Footer />
    </div>
  );
}
