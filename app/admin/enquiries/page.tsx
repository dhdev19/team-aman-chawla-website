"use client";

import * as React from "react";
import { enquiryApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { FilterDropdown } from "@/components/features/filter-dropdown";
import { Pagination } from "@/components/features/pagination";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

const enquiryTypeOptions = [
  { value: "", label: "All Types" },
  { value: "contact", label: "Contact" },
  { value: "property", label: "Property Enquiry" },
];

export default function EnquiriesListPage() {
  const [selectedType, setSelectedType] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 25;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-enquiries", selectedType, currentPage],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };
      if (selectedType) params.type = selectedType;

      const response = await enquiryApi.getAll();
      return response.data;
    },
  });

  const enquiries = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) {
      return;
    }

    try {
      await enquiryApi.delete(id);
      refetch();
    } catch (error) {
      alert("Failed to delete enquiry. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Enquiries
          </h1>
          <p className="text-neutral-600">
            Manage all contact form submissions and property enquiries
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterDropdown
          label="Enquiry Type"
          options={enquiryTypeOptions}
          value={selectedType}
          onChange={(value) => {
            setSelectedType(value);
            setCurrentPage(1);
          }}
          placeholder="All Types"
        />
      </div>

      {/* Enquiries Table */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Failed to load enquiries. Please try again later.
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-600 mb-4">No enquiries found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {enquiries.map((enquiry: any) => (
                    <tr key={enquiry.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {enquiry.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="text-sm text-primary-700 hover:underline"
                        >
                          {enquiry.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {enquiry.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded capitalize">
                          {enquiry.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {enquiry.property ? (
                          <Link
                            href={`/admin/properties/${enquiry.property.id}`}
                            className="text-primary-700 hover:underline"
                          >
                            {enquiry.property.name}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <div>{formatDate(enquiry.createdAt)}</div>
                        <div className="text-xs">
                          {formatRelativeTime(enquiry.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/enquiries/${enquiry.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(enquiry.id)}
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
