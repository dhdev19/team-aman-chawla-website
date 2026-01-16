import { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VideoGallery } from "@/components/sections/video-gallery";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { NewProjects } from "@/components/sections/new-projects";
import { AboutSection } from "@/components/sections/about-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { ContactSection } from "@/components/sections/contact-section";
import { OrganizationSchema } from "@/components/seo/schema-org";

export const metadata: Metadata = defaultMetadata;

export default function HomePage() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://teamamanchawla.com";

  return (
    <>
      <OrganizationSchema
        name="Team Aman Chawla"
        url={baseUrl}
        contactPoint={{
          contactType: "Customer Service",
        }}
      />
      <Navbar />
      <main>
        <VideoGallery />
        <FeaturedProjects />
        <NewProjects />
        <AboutSection />
        <TestimonialsSection />
        <WhyChooseUs />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
