"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { propertyApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { PropertyType, PropertyStatus } from "@prisma/client";
import { SearchBar } from "@/components/features/search-bar";
import { FilterDropdown } from "@/components/features/filter-dropdown";
import { Pagination } from "@/components/features/pagination";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const propertyTypeOptions = [
  { value: "", label: "All Types" },
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "OFFICES", label: "Offices" },
];

const propertyStatusOptions = [
  { value: "", label: "All Status" },
  { value: "AVAILABLE", label: "Available" },
  { value: "SOLD", label: "Sold" },
  { value: "RESERVED", label: "Reserved" },
];

export default function PropertiesListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<PropertyType | "">("");
  const [selectedStatus, setSelectedStatus] = React.useState<PropertyStatus | "">("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 25;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-properties", searchQuery, selectedType, selectedStatus, currentPage],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };
      if (searchQuery) params.search = searchQuery;
      if (selectedType) params.type = selectedType;
      if (selectedStatus) params.status = selectedStatus;

      const response = await propertyApi.getAll(params);
      return response.data;
    },
  });

  const properties = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      await propertyApi.delete(id);
      refetch();
    } catch (error) {
      alert("Failed to delete property. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Properties
          </h1>
          <p className="text-neutral-600">
            Manage all your property listings
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/admin/properties/new")}
        >
          + Add Property
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SearchBar
            placeholder="Search by name, builder, or location..."
            onSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
          />
        </div>
        <FilterDropdown
          label="Type"
          options={propertyTypeOptions}
          value={selectedType}
          onChange={(value) => {
            setSelectedType(value as PropertyType | "");
            setCurrentPage(1);
          }}
          placeholder="All Types"
        />
        <FilterDropdown
          label="Status"
          options={propertyStatusOptions}
          value={selectedStatus}
          onChange={(value) => {
            setSelectedStatus(value as PropertyStatus | "");
            setCurrentPage(1);
          }}
          placeholder="All Status"
        />
      </div>

      {/* Properties Table */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Failed to load properties. Please try again later.
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-600 mb-4">No properties found</p>
          <Button
            variant="primary"
            onClick={() => router.push("/admin/properties/new")}
          >
            Add Your First Property
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Builder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {properties.map((property: any) => (
                    <tr key={property.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {property.mainImage ? (
                          <div className="relative h-12 w-12 rounded overflow-hidden bg-neutral-200">
                            <Image
                              src={property.mainImage}
                              alt={property.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {property.name}
                        </div>
                        {property.location && (
                          <div className="text-sm text-neutral-500">
                            {property.location}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded capitalize">
                          {property.type.replace("_", " ").toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {property.builder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {formatCurrency(property.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/properties/${property.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/properties/${property.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
