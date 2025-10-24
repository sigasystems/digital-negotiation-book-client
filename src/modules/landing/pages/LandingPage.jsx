import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import PlansPage from "../components/PlansPage";

export default function LandingPage() {
  return (
    <motion.div
      className="flex flex-col min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* ✅ Smooth Section Fade-in Slide Animation */}
      <SectionWrapper>
        <Hero />
      </SectionWrapper>

      <SectionWrapper>
        <Features />
      </SectionWrapper>

      <SectionWrapper>
        <Testimonials />
      </SectionWrapper>

      <SectionWrapper>
        <CTA />
      </SectionWrapper>

      <SectionWrapper>
        <PlansPage />
      </SectionWrapper>
    </motion.div>
  );
}

// ✅ Reusable Animation Wrapper
function SectionWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
} 
