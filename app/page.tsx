import { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OldHomepage } from "@/components/sections/old-homepage";
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
        <OldHomepage />
      </main>
      <Footer />
    </>
  );
}
