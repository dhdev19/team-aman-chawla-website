"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";

export default function ThankYouPage() {
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
    <>
      <Navbar />
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <p className="text-neutral-800">
                    <span className="font-semibold">Expected Response Time:</span>{" "}
                    <br />
                    We typically respond to all inquiries within 24-48 hours during
                    business days. For urgent matters, you can also reach us on WhatsApp
                    or call directly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-primary-700 hover:bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => router.push("/contact")}
                    variant="outline"
                    className="border-2 border-primary-700 text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-lg font-semibold"
                  >
                    Contact Us Again
                  </Button>
                </div>
              </FadeIn>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
