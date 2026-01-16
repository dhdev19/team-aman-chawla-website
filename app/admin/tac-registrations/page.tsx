"use client";

import * as React from "react";
import { tacApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/features/pagination";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

export default function TACRegistrationsListPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 25;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-tac-registrations", currentPage],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };

      const response = await tacApi.getAll();
      return response.data;
    },
  });

  const registrations = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            TAC Registrations
          </h1>
          <p className="text-neutral-600">
            View all TAC registration submissions
          </p>
        </div>
      </div>

      {/* Registrations Table */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Failed to load registrations. Please try again later.
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-600 mb-4">
            No registrations found
          </p>
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
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {registrations.map((registration: any) => (
                    <tr key={registration.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {registration.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`mailto:${registration.email}`}
                          className="text-sm text-primary-700 hover:underline"
                        >
                          {registration.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        <a
                          href={`tel:${registration.phone}`}
                          className="text-primary-700 hover:underline"
                        >
                          {registration.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900">
                        {registration.address || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <div>{formatDate(registration.createdAt)}</div>
                        <div className="text-xs">
                          {formatRelativeTime(registration.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/tac-registrations/${registration.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
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
