"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormData } from "@/lib/validations";
import { enquiryApi } from "@/lib/api-client";
import { FadeIn } from "@/components/animations";

import { Suspense } from "react";

function EnquiryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("property");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      type: "enquiry",
      propertyId: propertyId || undefined,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await enquiryApi.create(data);
      if (response.success) {
        router.push("/thank-you?form=enquiry");
      } else {
        setSubmitStatus({
          type: "error",
          message: response.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send enquiry. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-primary-700 text-white py-12">
          <Container>
            <FadeIn>
              <h1 className="text-4xl font-bold mb-4">Property Enquiry</h1>
              <p className="text-lg text-primary-100">
                Interested in a property? Send us your enquiry
              </p>
            </FadeIn>
          </Container>
        </div>

        <Container className="py-12">
          <div className="max-w-2xl mx-auto">
            <FadeIn delay={0.2}>
              <Card>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Submit Your Enquiry
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
                        Name *
                      </label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {String(errors.name?.message || "")}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {String(errors.email?.message || "")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(errors.phone?.message || "")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      rows={6}
                      {...register("message")}
                      className={errors.message ? "border-red-500" : ""}
                      placeholder="Tell us about the property you're interested in..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(errors.message?.message || "")}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                  </Button>
                </form>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default function EnquiryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnquiryContent />
    </Suspense>
  );
}
