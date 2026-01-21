"use client";

import * as React from "react";
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

const propertyTypeOptions = [
  { value: "", label: "All Types" },
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "OFFICES", label: "Offices" },
];

export default function NewLaunchPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<PropertyType | "">("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 25;

  const { data, isLoading, error } = useQuery({
    queryKey: ["new-launch-properties", searchQuery, selectedType, currentPage],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
        status: "AVAILABLE", // Only show available properties for new launches
      };
      if (searchQuery) params.search = searchQuery;
      if (selectedType) params.type = selectedType;

      const response = await propertyApi.getAll(params);
      return response.data;
    },
  });

  const properties = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-primary-700 text-white py-12">
          <Container>
            <h1 className="text-4xl font-bold mb-4">New Launches</h1>
            <p className="text-lg text-primary-100">
              Discover our latest property launches - premium properties that are newly available
            </p>
          </Container>
        </div>

        <Container className="py-12">
          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SearchBar
                placeholder="Search new launches by name, builder, or location..."
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
          </div>

          {/* Properties Grid */}
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              Failed to load new launches. Please try again later.
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-600 mb-4">
                No new launches found
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
