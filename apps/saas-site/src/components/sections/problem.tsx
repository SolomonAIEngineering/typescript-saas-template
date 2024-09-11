import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Shield } from "lucide-react";

const problems = [
  {
    title: "Time-to-Market Pressure",
    description:
      "Financial institutions often take months to launch new products, falling behind in a fast-paced market.",
    icon: Clock,
  },
  {
    title: "Data Provider Costs",
    description:
      "Negotiating prices with multiple data providers is time-consuming and can lead to inflated costs.",
    icon: DollarSign,
  },
  {
    title: "Compliance Challenges",
    description:
      "Ensuring backend systems meet strict financial regulations is complex and resource-intensive.",
    icon: Shield,
  },
];

export default function Component() {
  return (
    <Section
      title="Industry Challenges"
      subtitle="Building compliant fintech products quickly is difficult and expensive."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}
