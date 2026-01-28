"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { propertyApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function PropertyViewPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const { data: property, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-property", propertyId],
    queryFn: async () => {
      const response = await propertyApi.getById(propertyId);
      return response.data;
    },
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    try {
      await propertyApi.delete(propertyId);
      router.push("/admin/properties");
    } catch (error) {
      alert("Failed to delete property. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !property) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load property</p>
        <Button variant="primary" onClick={() => router.push("/admin/properties")}>
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {property.name}
          </h1>
          <p className="text-neutral-600">
            View property details
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/properties/${property.id}/edit`}>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Images
            </h2>
            {property.mainImage ? (
              <div className="relative h-96 w-full rounded-lg overflow-hidden bg-neutral-200 mb-4">
                <Image
                  src={property.mainImage}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-48 w-full rounded-lg bg-neutral-200 flex items-center justify-center text-neutral-400 mb-4">
                No Main Image
              </div>
            )}

            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-24 w-full rounded overflow-hidden bg-neutral-200"
                  >
                    <Image
                      src={image}
                      alt={`${property.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Property Details */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Property Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Description
                </label>
                <p className="mt-1 text-neutral-900 whitespace-pre-line">
                  {property.description || "No description provided"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Property Type
                </label>
                <p className="mt-1 text-neutral-900 capitalize">
                  {property.type.replace("_", " ").toLowerCase()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Builder
                </label>
                <p className="mt-1 text-neutral-900">{property.builder}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      property.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : property.status === "SOLD"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {property.status}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Price
                </label>
                <p className="mt-1 text-neutral-900 text-lg font-semibold">
                  {formatCurrency(property.price)}
                </p>
              </div>

              {property.location && (
                <div>
                  <label className="text-sm font-medium text-neutral-600">
                    Location
                  </label>
                  <p className="mt-1 text-neutral-900">{property.location}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Created At
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatDate(property.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Updated At
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatDate(property.updatedAt)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <Link href={`/admin/properties/${property.id}/edit`} className="block">
                <Button variant="primary" className="w-full">
                  Edit Property
                </Button>
              </Link>
              <Button
                variant="danger"
                className="w-full"
                onClick={handleDelete}
              >
                Delete Property
              </Button>
              <Link
                href={`/properties/${property.slug || property.id}`}
                className="block"
              >
                <Button variant="ghost" className="w-full">
                  View Public Page
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
