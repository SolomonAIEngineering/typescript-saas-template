import dynamic from "next/dynamic";
import Blog from "@/components/sections/blog";
import CTA from "@/components/sections/cta";
import FAQ from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import HowItWorks from "@/components/sections/how-it-works";
import Logos from "@/components/sections/logos";
import Pricing from "@/components/sections/pricing";
import Problem from "@/components/sections/problem";
import Solution from "@/components/sections/solution";
import TestimonialsCarousel from "@/components/sections/testimonials-carousel";

const Testimonials = dynamic(
  () => import("@/components/sections/testimonials"),
  { ssr: false },
);

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Testimonials />
      <HowItWorks />
      {/* Remove or comment out this line */}
      {/* <TestimonialsCarousel /> */}
      <Features />
      <Pricing />
      <FAQ />
      <Blog />
      <CTA />
      <Footer />
    </>
  );
}
