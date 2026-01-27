"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { tacApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default function TACRegistrationViewPage() {
  const router = useRouter();
  const params = useParams();
  const registrationId = params.id as string;

  const { data: registration, isLoading, error, refetch } = useQuery<any>({
    queryKey: ["admin-tac-registration", registrationId],
    queryFn: async () => {
      const response = await tacApi.getAll();
      const registration = (response.data as any)?.data?.data?.find(
        (r: any) => r.id === registrationId
      );
      if (!registration) {
        throw new Error("Registration not found");
      }
      return registration;
    },
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !registration) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load registration</p>
        <Button
          variant="primary"
          onClick={() => router.push("/admin/tac-registrations")}
        >
          Back to Registrations
        </Button>
      </div>
    );
  }

  const registrationData = registration as any;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          TAC Registration Details
        </h1>
        <p className="text-neutral-600">View registration information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Registration Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Full Name
                </label>
                <p className="mt-1 text-neutral-900">{registrationData.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Email
                </label>
                <a
                  href={`mailto:${registrationData.email}`}
                  className="mt-1 text-primary-700 hover:underline block"
                >
                  {registrationData.email}
                </a>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Phone
                </label>
                <a
                  href={`tel:${registrationData.phone}`}
                  className="mt-1 text-primary-700 hover:underline block"
                >
                  {registrationData.phone}
                </a>
              </div>

              {registrationData.address && (
                <div>
                  <label className="text-sm font-medium text-neutral-600">
                    Address
                  </label>
                  <p className="mt-1 text-neutral-900 whitespace-pre-line">
                    {registrationData.address}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Registered On
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatDate(registrationData.createdAt)}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatRelativeTime(registrationData.createdAt)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <a href={`mailto:${registrationData.email}`} className="block">
                <Button variant="primary" className="w-full">
                  Send Email
                </Button>
              </a>
              <a href={`tel:${registrationData.phone}`} className="block">
                <Button variant="secondary" className="w-full">
                  Call
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
