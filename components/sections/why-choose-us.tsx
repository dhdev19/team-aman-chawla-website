import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { FadeIn, SlideIn } from "@/components/animations";

const features = [
  {
    icon: "🏆",
    title: "Expert Team",
    description:
      "Our experienced consultants have in-depth knowledge of the real estate market and are committed to your success.",
  },
  {
    icon: "🔍",
    title: "Wide Selection",
    description:
      "Browse through hundreds of properties across residential, commercial, plots, and office spaces.",
  },
  {
    icon: "🤝",
    title: "Personalized Service",
    description:
      "We understand your unique needs and provide tailored solutions to help you find the perfect property.",
  },
  {
    icon: "💼",
    title: "Trusted Partner",
    description:
      "With years of experience and a proven track record, we're your trusted partner in real estate.",
  },
  {
    icon: "📱",
    title: "Easy Process",
    description:
      "Streamlined processes and modern technology make property search and transactions hassle-free.",
  },
  {
    icon: "✅",
    title: "Verified Properties",
    description:
      "All our properties are verified and come with complete documentation for your peace of mind.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <Container>
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-neutral-600">
              Discover what makes Team Aman Chawla the right choice for you
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <SlideIn
              key={feature.title}
              direction="up"
              delay={index * 0.1}
              duration={0.5}
            >
              <Card variant="outlined" className="text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </Card>
            </SlideIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
