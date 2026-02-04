"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = searchParams.get("form") || "enquiry";

  const getTitleAndMessage = (type: string) => {
    switch (type) {
      case "contact":
        return {
          title: "Thank You for Contacting Us!",
          message:
            "We've received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you as soon as possible.",
        };
      case "enquiry":
        return {
          title: "Thank You for Your Inquiry!",
          message:
            "We've received your inquiry and will be in touch with you shortly. Thank you for your interest in our properties.",
        };
      case "career":
        return {
          title: "Thank You for Applying!",
          message:
            "We've received your application and appreciate your interest in joining Team Aman Chawla. We'll review your qualifications and get back to you soon.",
        };
      case "refer":
        return {
          title: "Thank You for Your Referral!",
          message:
            "We've received your referral and appreciate you thinking of us. We'll follow up shortly.",
        };
      default:
        return {
          title: "Thank You!",
          message:
            "We've received your submission. Thank you for getting in touch with us. We'll be in contact soon.",
        };
    }
  };

  const { title, message } = getTitleAndMessage(formType);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100">
        <Container className="py-20">
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              {/* Success Icon */}
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                {title}
              </h1>

              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                {message}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/")}
                  className="bg-primary-700 hover:bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => {
                    const whatsappUrl = "https://wa.me/919118388999?text=Hello,%20I%20am%20interested%20in%20your%20properties.";
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.782 1.14l-.46-.23L1.29 2.584A.5.5 0 002.06 3.363l1.061 3.13a9.877 9.877 0 003.638 6.282l.533.533a9.876 9.876 0 006.282 3.638l3.13 1.061a.5.5 0 00.628-.765l-2.052-6.082-.23-.46a9.87 9.87 0 00-5.432-5.348z" />
                  </svg>
                  Chat on WhatsApp
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <React.Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
        <ThankYouContent />
      </React.Suspense>
      <Footer />
    </>
  );
}
