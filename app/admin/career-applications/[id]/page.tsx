"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { careerApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { ReferralSource } from "@/lib/validations/career";
import { formatDate } from "date-fns";
import type { ApiResponse, CareerApplication } from "@/types";

export default function CareerApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const { data, isLoading, error } = useQuery<CareerApplication | undefined>({
    queryKey: ["admin-career-application", applicationId],
    queryFn: async () => {
      const response = (await careerApi.getById(applicationId)) as ApiResponse<CareerApplication>;
      return response.data;
    },
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this career application?")) return;
    
    try {
      await careerApi.delete(applicationId);
      router.push("/admin/career-applications");
    } catch (error) {
      alert("Failed to delete career application");
    }
  };

  const getReferralSourceLabel = (source: string) => {
    const sourceLabels = {
      [ReferralSource.FAMILY_FRIENDS]: "Family/Friends",
      [ReferralSource.WEBSITE]: "Website",
      [ReferralSource.YOUTUBE]: "YouTube",
      [ReferralSource.ADVERTISEMENT]: "Advertisement",
      [ReferralSource.OTHER]: "Other",
    };
    return sourceLabels[source as keyof typeof sourceLabels] || source;
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load career application</p>
        <Button variant="primary" onClick={() => router.push("/admin/career-applications")}>
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/career-applications")}
          className="mb-4"
        >
          ← Back to Applications
        </Button>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Career Application Details
        </h1>
        <p className="text-neutral-600">View career application information</p>
      </div>

      <div className="grid gap-6">
        {/* Main Information */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                {data.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                  {getReferralSourceLabel(data.referralSource)}
                </span>
                <span className="text-sm text-neutral-500">
                  Applied on {formatDate(new Date(data.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete Application
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
                Contact Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <p className="text-sm text-neutral-900">{data.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <p className="text-sm text-neutral-900">
                  <a
                    href={`mailto:${data.email}`}
                    className="text-primary-700 hover:text-primary-800"
                  >
                    {data.email}
                  </a>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  WhatsApp Number
                </label>
                <p className="text-sm text-neutral-900">
                  <a
                    href={`https://wa.me/91${data.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-700 hover:text-primary-800"
                  >
                    +91 {data.whatsappNumber}
                  </a>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  City
                </label>
                <p className="text-sm text-neutral-900">{data.city}</p>
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
                Application Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  How they came to know about us
                </label>
                <p className="text-sm text-neutral-900">
                  {getReferralSourceLabel(data.referralSource)}
                </p>
              </div>
              
              {data.referralOther && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Other Source Details
                  </label>
                  <p className="text-sm text-neutral-900">{data.referralOther}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Resume
                </label>
                <p className="text-sm">
                  <a
                    href={data.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium"
                  >
                    View Resume
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Application Submitted
                </label>
                <p className="text-sm text-neutral-900">
                  {formatDate(new Date(data.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </a>
            
            <a
              href={`https://wa.me/91${data.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              WhatsApp
            </a>
            
            <a
              href={data.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}