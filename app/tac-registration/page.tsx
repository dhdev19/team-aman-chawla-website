"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tacRegistrationSchema, type TACRegistrationFormData } from "@/lib/validations";
import { tacApi } from "@/lib/api-client";
import { FadeIn } from "@/components/animations";

export default function TACRegistrationPage() {
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
    resolver: zodResolver(tacRegistrationSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await tacApi.create(data);
      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: "Registration successful! We'll contact you soon.",
        });
        reset();
      } else {
        setSubmitStatus({
          type: "error",
          message: response.error || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to submit registration. Please try again later.",
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
              <h1 className="text-4xl font-bold mb-4">TAC Registration</h1>
              <p className="text-lg text-primary-100">
                Register with Team Aman Chawla to get exclusive property updates
                and offers
              </p>
            </FadeIn>
          </Container>
        </div>

        <Container className="py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Registration Form
              </h2>
              <p className="text-neutral-600 mb-6">
                Fill out the form below to register with Team Aman Chawla. We'll
                keep you updated on new properties, exclusive offers, and market
                insights.
              </p>

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

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Full Name *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Phone *
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
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Address
                  </label>
                  <Textarea
                    id="address"
                    rows={3}
                    {...register("address")}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.address?.message || "")}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Now"}
                </Button>
              </form>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
