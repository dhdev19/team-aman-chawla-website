"use client";

import * as React from "react";
import { emailSubscriptionApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

interface WhatsAppEmailSectionProps {
  whatsappNumber?: string;
  whatsappCommunityLink?: string;
}

export function WhatsAppEmailSection({
  whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+1234567890",
  whatsappCommunityLink = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_LINK || "#",
}: WhatsAppEmailSectionProps) {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleWhatsAppCommunityClick = () => {
    window.open(whatsappCommunityLink, "_blank");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await emailSubscriptionApi.subscribe(email);
      if (response.success) {
        setMessage({ type: "success", text: "Successfully subscribed to updates!" });
        setEmail("");
      } else {
        setMessage({ type: "error", text: response.error || "Failed to subscribe" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to subscribe. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-primary-50 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connect on WhatsApp */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Connect on WhatsApp
            </h3>
            <p className="text-neutral-600 mb-4 text-sm">
              Chat with us directly for instant support
            </p>
            <Button
              variant="primary"
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Chat Now
            </Button>
          </Card>

          {/* Join WhatsApp Community */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Join WhatsApp Community
            </h3>
            <p className="text-neutral-600 mb-4 text-sm">
              Connect with our community for updates and discussions
            </p>
            <Button
              variant="primary"
              onClick={handleWhatsAppCommunityClick}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Join Community
            </Button>
          </Card>

          {/* Email Subscription */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4 text-center">
              <svg
                className="w-16 h-16 mx-auto text-primary-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2 text-center">
              Subscribe to Updates
            </h3>
            <p className="text-neutral-600 mb-4 text-sm text-center">
              Get the latest property updates via email
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
              {message && (
                <p
                  className={`text-sm text-center ${
                    message.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          </Card>
        </div>
      </Container>
    </section>
  );
}
