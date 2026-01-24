"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormData } from "@/lib/validations";
import { enquiryApi } from "@/lib/api-client";

interface PropertyContactFormProps {
  propertyId: string;
  propertyName: string;
  propertyPrice?: number;
}

export function PropertyContactForm({
  propertyId,
  propertyName,
  propertyPrice,
}: PropertyContactFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      propertyId: propertyId,
      message: `Query from ${propertyName}`,
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await enquiryApi.create({
        ...data,
        propertyId: propertyId,
      });
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
        message: "Failed to send inquiry. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">
        Contact Us
      </h2>
      <p className="text-neutral-600 mb-6">
        Interested in {propertyName}? Fill out the form below and we'll get back
        to you soon.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitStatus.type && (
          <div
            className={`p-3 rounded-md text-sm ${
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
            htmlFor="property-name"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Name *
          </label>
          <Input
            id="property-name"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="property-email"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Email *
          </label>
          <Input
            id="property-email"
            type="email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="property-phone"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Phone
          </label>
          <Input
            id="property-phone"
            type="tel"
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
            placeholder="Your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Inquiry"}
        </Button>
      </form>
    </div>
  );
}
