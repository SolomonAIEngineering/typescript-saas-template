import Features from "@/components/features-vertical";
import Section from "@/components/section";
import { Code, Rocket, Zap } from "lucide-react";

const data = [
  {
    id: 1,
    title: "1. Choose Your Fintech Product",
    content:
      "Select from our range of pre-built fintech components, including digital banking, payment processing, and lending solutions. Customize as needed for your specific use case.",
    image: "/dashboard.png",
    icon: <Zap className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    title: "2. Configure and Integrate",
    content:
      "Quickly configure your chosen components and integrate with our secure, compliant backend. Connect to necessary data providers through our unified API.",
    image: "/dashboard.png",
    icon: <Code className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    title: "3. Launch Your Fintech Product",
    content:
      "With everything set up, launch your fully compliant fintech product in days, not months. Iterate and scale rapidly as your business grows.",
    image: "/dashboard.png",
    icon: <Rocket className="w-6 h-6 text-primary" />,
  },
];

export default function Component() {
  return (
    <Section
      title="How It Works"
      subtitle="Build Your Fintech Product in 3 Simple Steps"
    >
      <Features data={data} />
    </Section>
  );
}
