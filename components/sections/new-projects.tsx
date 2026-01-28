"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { SearchBar } from "@/components/features/search-bar";
import { FilterDropdown } from "@/components/features/filter-dropdown";
import { PropertyCard } from "@/components/features/property-card";
import { Pagination } from "@/components/features/pagination";
import { PropertyType } from "@prisma/client";
import { FadeIn } from "@/components/animations/fade-in";
import { LoadingSpinner } from "@/components/ui/loading";
import { propertyApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

const propertyTypeOptions = [
  { value: "", label: "All Types" },
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "OFFICES", label: "Offices" },
];

export function NewProjects() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<PropertyType | "">("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", searchQuery, selectedType, currentPage],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
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
    <section className="py-16 bg-neutral-50">
      <Container>
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              New Projects
            </h2>
            <p className="text-lg text-neutral-600">
              Browse our latest property listings
            </p>
          </div>
        </FadeIn>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search properties..."
              onSearch={setSearchQuery}
            />
          </div>
          <div className="w-full sm:w-64">
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
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            Failed to load properties. Please try again later.
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            No properties found. Try adjusting your filters.
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
    </section>
  );
}
