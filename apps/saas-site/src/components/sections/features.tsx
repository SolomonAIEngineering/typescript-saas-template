import Features from "@/components/features-horizontal";
import Section from "@/components/section";
import { Rocket, Shield, Zap, Code } from "lucide-react";

const data = [
  {
    id: 1,
    title: "Rapid Development",
    content: "Build and launch fintech products in days, not months.",
    image: "/rapid-development.png",
    icon: <Rocket className="h-6 w-6 text-primary" />,
  },
  {
    id: 2,
    title: "Integrated Data Providers",
    content: "Access multiple financial data sources through a single API.",
    image: "/data-integration.png",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    id: 3,
    title: "Compliant Backend",
    content:
      "Build on a secure infrastructure that meets financial regulations.",
    image: "/compliant-backend.png",
    icon: <Shield className="h-6 w-6 text-primary" />,
  },
  {
    id: 4,
    title: "Customizable Components",
    content: "Tailor fintech solutions to your specific needs with ease.",
    image: "/customizable-components.png",
    icon: <Code className="h-6 w-6 text-primary" />,
  },
];

export default function Component() {
  return (
    <Section title="Features" subtitle="Accelerate Your Fintech Innovation">
      <Features collapseDelay={5000} linePosition="bottom" data={data} />
    </Section>
  );
}
