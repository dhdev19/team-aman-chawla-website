import { Container } from "@/components/ui/container";
import { FadeIn, SlideIn } from "@/components/animations";
import Image from "next/image";

export function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn delay={0.2}>
            <div className="relative h-96 w-full rounded-lg overflow-hidden bg-neutral-200">
              {/* Placeholder for team image */}
              <div className="flex items-center justify-center h-full text-neutral-400">
                Team Image
              </div>
            </div>
          </FadeIn>

          <SlideIn direction="right" delay={0.3}>
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                About Team Aman Chawla
              </h2>
              <div className="space-y-4 text-neutral-700">
                <p>
                  Team Aman Chawla is a leading real estate consultancy firm
                  dedicated to helping you find your perfect property. With years
                  of experience in the industry, we specialize in residential,
                  commercial, plot, and office spaces.
                </p>
                <p>
                  Our team of expert consultants is committed to providing
                  personalized service and ensuring that every client finds their
                  ideal property. We understand that buying or investing in
                  property is a significant decision, and we're here to guide you
                  through every step of the process.
                </p>
                <p>
                  Whether you're looking for a dream home, a commercial space for
                  your business, or a plot for investment, Team Aman Chawla is
                  your trusted partner in real estate.
                </p>
              </div>
              <div className="mt-8">
                <a
                  href="/about"
                  className="inline-block px-6 py-3 bg-primary-700 text-white rounded-md hover:bg-primary-800 transition-colors"
                >
                  Learn More About Us
                </a>
              </div>
            </div>
          </SlideIn>
        </div>
      </Container>
    </section>
  );
}
