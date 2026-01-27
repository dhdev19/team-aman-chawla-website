"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormData } from "@/lib/validations";
import { enquiryApi } from "@/lib/api-client";

export function BlogContactForm() {
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
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(enquirySchema) as any,
  });

  const emailValue = watch("email");
  const messageValue = watch("message");

  // Set defaults if fields are empty
  React.useEffect(() => {
    if (!emailValue || emailValue.trim() === "") {
      setValue("email", "johndoe@example.com", { shouldValidate: false });
    }
    if (!messageValue || messageValue.trim() === "") {
      setValue("message", "Query from blog contact us page", { shouldValidate: false });
    }
  }, [emailValue, messageValue, setValue]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Apply defaults if fields are empty or not provided
    const formData: EnquiryFormData = {
      name: data.name,
      email: data.email?.trim() || "johndoe@example.com",
      phone: data.phone || null,
      message: data.message?.trim() || "Query from blog contact us page",
      type: data.type || "contact",
      propertyId: data.propertyId || null,
    };

    try {
      const response = await enquiryApi.create(formData);
      if (response.success) {
        router.push("/thank-you?form=contact");
      } else {
        setSubmitStatus({
          type: "error",
          message: response.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
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
            htmlFor="blog-contact-name"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Name
          </label>
          <Input
            id="blog-contact-name"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{String(errors.name?.message || "")}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="blog-contact-email"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Email
          </label>
          <Input
            id="blog-contact-email"
            type="email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
            placeholder="johndoe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{String(errors.email?.message || "")}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="blog-contact-phone"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Phone
          </label>
          <Input
            id="blog-contact-phone"
            type="tel"
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
            placeholder="Your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{String(errors.phone?.message || "")}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="blog-contact-message"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Message
          </label>
          <Textarea
            id="blog-contact-message"
            rows={4}
            {...register("message")}
            className={errors.message ? "border-red-500" : ""}
            placeholder="Your message"
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">
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
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}
