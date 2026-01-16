import { Container } from "@/components/ui/container";
import { AutoSlider } from "@/components/animations/auto-slider";
import { TestimonialCard, Testimonial } from "@/components/features/testimonial-card";
import { FadeIn } from "@/components/animations/fade-in";

// Placeholder testimonials - in production, fetch from database
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Business Owner",
    company: "Tech Solutions Pvt Ltd",
    content:
      "Team Aman Chawla helped us find the perfect office space for our growing business. Their professionalism and attention to detail made the entire process smooth and stress-free.",
    rating: 5,
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Home Buyer",
    content:
      "I couldn't be happier with my new home! The team was incredibly patient and helped me find exactly what I was looking for. Highly recommend their services.",
    rating: 5,
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "Investor",
    content:
      "Excellent investment advice and property recommendations. Team Aman Chawla understands the market well and helped me make informed decisions.",
    rating: 5,
  },
  {
    id: "4",
    name: "Sneha Reddy",
    role: "Property Owner",
    content:
      "Professional service from start to finish. They helped me sell my property quickly and at a great price. Thank you Team Aman Chawla!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const testimonialCards = testimonials.map((testimonial) => (
    <div key={testimonial.id} className="px-2">
      <TestimonialCard testimonial={testimonial} />
    </div>
  ));

  return (
    <section className="py-16 bg-neutral-50">
      <Container>
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-neutral-600">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
        </FadeIn>
        <AutoSlider
          items={testimonialCards}
          interval={7000}
          showDots={true}
          showArrows={true}
        />
      </Container>
    </section>
  );
}
