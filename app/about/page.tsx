import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { generatePageMetadata } from "@/lib/metadata";
import { FadeIn, SlideIn } from "@/components/animations";

export const metadata: Metadata = generatePageMetadata(
  "About Us - Team Aman Chawla",
  "Learn more about Team Aman Chawla, your trusted real estate partner. Discover our mission, values, and commitment to helping you find your perfect property."
);

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-primary-700 text-white py-12">
          <Container>
            <FadeIn>
              <h1 className="text-4xl font-bold mb-4">About Team Aman Chawla</h1>
              <p className="text-lg text-primary-100">
                Your trusted partner in real estate
              </p>
            </FadeIn>
          </Container>
        </div>

        <Container className="py-12">
          <div className="space-y-12">
            {/* Mission Section */}
            <SlideIn direction="up">
              <Card>
                <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-neutral-700 mb-4">
                  At Team Aman Chawla, our mission is to help individuals and
                  businesses find their perfect property. We believe that finding
                  the right property is not just about location and price—it's
                  about finding a place that aligns with your dreams, goals, and
                  lifestyle.
                </p>
                <p className="text-lg text-neutral-700">
                  We are committed to providing exceptional service, transparent
                  communication, and expert guidance throughout your property
                  journey.
                </p>
              </Card>
            </SlideIn>

            {/* Values Section */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Integrity",
                    description:
                      "We conduct business with honesty, transparency, and ethical practices. Your trust is our most valuable asset.",
                  },
                  {
                    title: "Excellence",
                    description:
                      "We strive for excellence in every interaction, ensuring you receive the highest quality service and support.",
                  },
                  {
                    title: "Client-Centric",
                    description:
                      "Your needs and goals are at the center of everything we do. We're here to serve you, not just sell properties.",
                  },
                ].map((value, index) => (
                  <SlideIn key={value.title} direction="up" delay={index * 0.1}>
                    <Card variant="outlined" className="h-full">
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-neutral-700">{value.description}</p>
                    </Card>
                  </SlideIn>
                ))}
              </div>
            </div>

            {/* Why Choose Us Section */}
            <SlideIn direction="up" delay={0.3}>
              <Card>
                <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                  Why Choose Team Aman Chawla?
                </h2>
                <div className="space-y-4 text-neutral-700">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Extensive Experience
                    </h3>
                    <p>
                      With years of experience in the real estate industry, we
                      have the knowledge and expertise to guide you through every
                      step of your property journey.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Wide Selection
                    </h3>
                    <p>
                      From residential homes to commercial spaces, plots, and
                      offices, we offer a diverse portfolio of properties to meet
                      your unique needs.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Personalized Service
                    </h3>
                    <p>
                      We understand that every client is unique. That's why we
                      provide personalized service tailored to your specific
                      requirements and preferences.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Trusted Network
                    </h3>
                    <p>
                      Our strong network of builders, developers, and industry
                      professionals ensures you have access to the best
                      opportunities in the market.
                    </p>
                  </div>
                </div>
              </Card>
            </SlideIn>

            {/* CTA Section */}
            <SlideIn direction="up" delay={0.4}>
              <Card variant="elevated" className="bg-primary-50 border-primary-200">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                    Ready to Find Your Perfect Property?
                  </h2>
                  <p className="text-lg text-neutral-700 mb-6">
                    Let's start your property journey together. Contact us today
                    to discuss your needs.
                  </p>
                  <a
                    href="/contact"
                    className="inline-block px-8 py-3 bg-primary-700 text-white rounded-md hover:bg-primary-800 transition-colors font-semibold"
                  >
                    Get In Touch
                  </a>
                </div>
              </Card>
            </SlideIn>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
