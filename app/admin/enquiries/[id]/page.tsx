"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { enquiryApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import type { ApiResponse, EnquiryWithProperty, PaginatedResponse } from "@/types";

export default function EnquiryViewPage() {
  const router = useRouter();
  const params = useParams();
  const enquiryId = params.id as string;

  const { data: enquiry, isLoading, error, refetch } = useQuery<EnquiryWithProperty>({
    queryKey: ["admin-enquiry", enquiryId],
    queryFn: async () => {
      const response = (await enquiryApi.getAll()) as ApiResponse<
        PaginatedResponse<EnquiryWithProperty>
      >;
      const enquiry = response.data?.data?.find((e) => e.id === enquiryId);
      if (!enquiry) {
        throw new Error("Enquiry not found");
      }
      return enquiry;
    },
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) {
      return;
    }

    try {
      await enquiryApi.delete(enquiryId);
      router.push("/admin/enquiries");
    } catch (error) {
      alert("Failed to delete enquiry. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !enquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load enquiry</p>
        <Button variant="primary" onClick={() => router.push("/admin/enquiries")}>
          Back to Enquiries
        </Button>
      </div>
    );
  }

  const enquiryData = enquiry;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Enquiry Details
          </h1>
          <p className="text-neutral-600">View enquiry information</p>
        </div>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Message
            </h2>
            <p className="text-neutral-700 whitespace-pre-line">
              {enquiryData.message}
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Name
                </label>
                <p className="mt-1 text-neutral-900">{enquiryData.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Email
                </label>
                <a
                  href={`mailto:${enquiryData.email}`}
                  className="mt-1 text-primary-700 hover:underline block"
                >
                  {enquiryData.email}
                </a>
              </div>

              {enquiryData.phone && (
                <div>
                  <label className="text-sm font-medium text-neutral-600">
                    Phone
                  </label>
                  <a
                    href={`tel:${enquiryData.phone}`}
                    className="mt-1 text-primary-700 hover:underline block"
                  >
                    {enquiryData.phone}
                  </a>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Enquiry Type
                </label>
                <p className="mt-1">
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded capitalize">
                    {enquiryData.type}
                  </span>
                </p>
              </div>

              {enquiryData.property && (
                <div>
                  <label className="text-sm font-medium text-neutral-600">
                    Related Property
                  </label>
                  <Link
                    href={`/admin/properties/${enquiryData.property.id}`}
                    className="mt-1 text-primary-700 hover:underline block"
                  >
                    {enquiryData.property.name}
                  </Link>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Submitted
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatDate(enquiryData.createdAt)}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatRelativeTime(enquiryData.createdAt)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <a href={`mailto:${enquiryData.email}`} className="block">
                <Button variant="primary" className="w-full">
                  Reply via Email
                </Button>
              </a>
              {enquiryData.phone && (
                <a href={`tel:${enquiryData.phone}`} className="block">
                  <Button variant="secondary" className="w-full">
                    Call
                  </Button>
                </a>
              )}
              <Button
                variant="danger"
                className="w-full"
                onClick={handleDelete}
              >
                Delete Enquiry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
