import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import PlansPage from "../components/PlansPage";
import { useSelector } from "react-redux";



export default function LandingPage() {
  const paymentId = useSelector((state) => state.payment.paymentId);


  return (
    <div className="flex flex-col min-h-screen">
      
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <PlansPage/>
    </div>
  );
}
