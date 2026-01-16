"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideIn } from "@/components/animations";

export default function ReferPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus({
        type: "success",
        message: "Thank you for your referral! We'll contact you soon.",
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-primary-700 text-white py-12">
          <Container>
            <FadeIn>
              <h1 className="text-4xl font-bold mb-4">Refer & Earn</h1>
              <p className="text-lg text-primary-100">
                Refer friends and family and earn rewards
              </p>
            </FadeIn>
          </Container>
        </div>

        <Container className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Referral Form */}
            <FadeIn delay={0.2}>
              <Card>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Refer Someone
                </h2>
                <p className="text-neutral-600 mb-6">
                  Know someone looking for a property? Refer them to us and earn
                  exciting rewards when they make a purchase!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus.type && (
                    <div
                      className={`p-4 rounded-md ${
                        submitStatus.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="yourName"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Your Name *
                    </label>
                    <Input id="yourName" required />
                  </div>

                  <div>
                    <label
                      htmlFor="yourEmail"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Your Email *
                    </label>
                    <Input id="yourEmail" type="email" required />
                  </div>

                  <div>
                    <label
                      htmlFor="yourPhone"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Your Phone *
                    </label>
                    <Input id="yourPhone" type="tel" required />
                  </div>

                  <div>
                    <label
                      htmlFor="referralName"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Referral's Name *
                    </label>
                    <Input id="referralName" required />
                  </div>

                  <div>
                    <label
                      htmlFor="referralEmail"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Referral's Email *
                    </label>
                    <Input id="referralEmail" type="email" required />
                  </div>

                  <div>
                    <label
                      htmlFor="referralPhone"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Referral's Phone *
                    </label>
                    <Input id="referralPhone" type="tel" required />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Additional Message
                    </label>
                    <Textarea id="message" rows={4} />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Referral"}
                  </Button>
                </form>
              </Card>
            </FadeIn>

            {/* Benefits Section */}
            <FadeIn delay={0.3}>
              <div className="space-y-6">
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    How It Works
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Refer Someone",
                        description:
                          "Fill out the referral form with your and your referral's details.",
                      },
                      {
                        step: "2",
                        title: "We Contact Them",
                        description:
                          "Our team will reach out to your referral and assist them in finding their perfect property.",
                      },
                      {
                        step: "3",
                        title: "Earn Rewards",
                        description:
                          "When your referral makes a purchase, you'll receive exciting rewards!",
                      },
                    ].map((item) => (
                      <SlideIn key={item.step} direction="right" delay={0.1}>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-700 text-white rounded-full flex items-center justify-center font-bold">
                            {item.step}
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-neutral-600">{item.description}</p>
                          </div>
                        </div>
                      </SlideIn>
                    ))}
                  </div>
                </Card>

                <Card variant="elevated" className="bg-primary-50 border-primary-200">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">
                    Benefits of Referring
                  </h3>
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Earn cash rewards on successful referrals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Help friends and family find their dream property</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>No limit on the number of referrals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Exclusive offers and updates</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </FadeIn>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
