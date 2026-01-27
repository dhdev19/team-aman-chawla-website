"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { SearchBar } from "@/components/features/search-bar";
import { FilterDropdown } from "@/components/features/filter-dropdown";
import { PropertyCard } from "@/components/features/property-card";
import { Pagination } from "@/components/features/pagination";
import { LoadingSpinner } from "@/components/ui/loading";
import { PropertyType } from "@prisma/client";
import { propertyApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

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

import { Suspense } from "react";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<PropertyType | "">(
    (searchParams.get("type")?.toUpperCase() as PropertyType) || ""
  );
  const [selectedStatus, setSelectedStatus] = React.useState(
    searchParams.get("status") || ""
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 25;

  const { data, isLoading, error, refetch } = useQuery<{
    success: boolean;
    data: {
      data: any[];
      pagination: any;
    };
  }>({
    queryKey: ["properties", searchQuery, selectedType, selectedStatus, currentPage],
    queryFn: async (): Promise<{
      success: boolean;
      data: {
        data: any[];
        pagination: any;
      };
    }> => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };
      if (searchQuery) params.search = searchQuery;
      if (selectedType) params.type = selectedType;
      if (selectedStatus) params.status = selectedStatus;

      const response = await propertyApi.getAll(params);
      return response.data as {
        success: boolean;
        data: {
          data: any[];
          pagination: any;
        };
      };
    },
  });

  const properties = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-primary-700 text-white py-12">
          <Container>
            <h1 className="text-4xl font-bold mb-4">Our Properties</h1>
            <p className="text-lg text-primary-100">
              Discover a wide range of premium properties tailored to your needs
            </p>
          </Container>
        </div>

        <Container className="py-12">
          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                placeholder="Search properties by name, builder, or location..."
                onSearch={(query) => {
                  setSearchQuery(query);
                  setCurrentPage(1);
                }}
              />
            </div>
            <FilterDropdown
              label="Property Type"
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
                setSelectedStatus(value);
                setCurrentPage(1);
              }}
              placeholder="All Status"
            />
          </div>

          {/* Properties Grid */}
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              Failed to load properties. Please try again later.
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-600 mb-4">
                No properties found
              </p>
              <p className="text-neutral-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {properties.map((property: any) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
