"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerApplicationSchema, type CareerApplicationFormData, ReferralSource } from "@/lib/validations/career";
import { careerApi } from "@/lib/api-client";
import { FadeIn } from "@/components/animations";

export default function CareersPage() {
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
    watch,
  } = useForm<CareerApplicationFormData>({
    resolver: zodResolver(careerApplicationSchema),
  });

  const referralSource = watch("referralSource");

  const onSubmit = async (data: CareerApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await careerApi.submit(data);
      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your application has been submitted successfully. We'll review it and get back to you soon.",
        });
        reset();
      } else {
        setSubmitStatus({
          type: "error",
          message: response.error || "Failed to submit application",
        });
      }
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const referralOptions = [
    { value: ReferralSource.FAMILY_FRIENDS, label: "Family/Friends" },
    { value: ReferralSource.WEBSITE, label: "Website" },
    { value: ReferralSource.YOUTUBE, label: "YouTube" },
    { value: ReferralSource.ADVERTISEMENT, label: "Advertisement" },
    { value: ReferralSource.OTHER, label: "Other" },
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-neutral-50 pt-20">
        <Container>
          <FadeIn>
            <div className="max-w-4xl mx-auto py-12">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                  Join Our Team
                </h1>
                <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                  Be part of a dynamic team that's shaping the future of real estate. 
                  We're looking for passionate professionals to join our growing family.
                </p>
              </div>

              {/* Why Join Us Section */}
              <div className="mb-12">
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    Why Join Team Aman Chawla?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Growth Opportunities</h3>
                      <p className="text-sm text-neutral-600">
                        Continuous learning and career advancement in the real estate industry
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Great Team</h3>
                      <p className="text-sm text-neutral-600">
                        Work with experienced professionals in a collaborative environment
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Competitive Benefits</h3>
                      <p className="text-sm text-neutral-600">
                        Attractive compensation packages and performance-based incentives
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Application Form */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Apply Now
                </h2>
                <p className="text-neutral-600 mb-8">
                  Fill out the form below to submit your application. We'll review it and get back to you within 2-3 business days.
                </p>

                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-lg mb-6 ${
                      submitStatus.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    <p className="text-sm font-medium">{submitStatus.message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        WhatsApp Number *
                      </label>
                      <Input
                        {...register("whatsappNumber")}
                        className={errors.whatsappNumber ? "border-red-500" : ""}
                        placeholder="Enter your WhatsApp number"
                      />
                      {errors.whatsappNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.whatsappNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        City *
                      </label>
                      <Input
                        {...register("city")}
                        className={errors.city ? "border-red-500" : ""}
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* How did you know about us */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      How did you come to know about us? *
                    </label>
                    <Select
                      {...register("referralSource")}
                      className={errors.referralSource ? "border-red-500" : ""}
                    >
                      <option value="">Select an option</option>
                      {referralOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {errors.referralSource && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.referralSource.message}
                      </p>
                    )}
                  </div>

                  {/* Other referral source input */}
                  {referralSource === ReferralSource.OTHER && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Please specify *
                      </label>
                      <Input
                        {...register("referralOther")}
                        className={errors.referralOther ? "border-red-500" : ""}
                        placeholder="Please specify how you came to know about us"
                      />
                      {errors.referralOther && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.referralOther.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Resume Link */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Resume Link *
                    </label>
                    <Input
                      {...register("resumeLink")}
                      className={errors.resumeLink ? "border-red-500" : ""}
                      placeholder="Google Drive, Dropbox, or other cloud storage link to your resume"
                    />
                    {errors.resumeLink && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.resumeLink.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      Please ensure your resume is accessible via the shared link
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end pt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="min-w-[140px]"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </FadeIn>
        </Container>
      </main>

      <Footer />
    </>
  );
}