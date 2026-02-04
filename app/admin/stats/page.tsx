"use client";

import * as React from "react";
import { statsApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/animations";
import type { ApiResponse, PageStat } from "@/types";

export default function PageStatsPage() {
  const { data, isLoading, error } = useQuery<PageStat[] | undefined>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = (await statsApi.getAll()) as ApiResponse<PageStat[]>;
      return response.data;
    },
  });

  const stats = data || [];

  // Sort by click count descending
  const sortedStats = [...stats].sort((a, b) => b.clickCount - a.clickCount);

  const totalClicks = stats.reduce((sum, stat) => sum + (stat.clickCount || 0), 0);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load statistics. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Page Statistics
        </h1>
        <p className="text-neutral-600">
          Track clicks and engagement across all pages
        </p>
      </div>

      {/* Summary Card */}
      <FadeIn>
        <Card className="mb-6 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Clicks</p>
              <p className="text-4xl font-bold text-primary-700">
                {totalClicks.toLocaleString()}
              </p>
            </div>
            <div className="text-5xl">📊</div>
          </div>
        </Card>
      </FadeIn>

      {/* Stats Table */}
      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Page Click Statistics
        </h2>
        {sortedStats.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No statistics available yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Page Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Click Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Last Clicked
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {sortedStats.map((stat: any) => {
                  const percentage =
                    totalClicks > 0
                      ? ((stat.clickCount / totalClicks) * 100).toFixed(1)
                      : "0.0";

                  return (
                    <tr key={stat.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {stat.pageName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-neutral-900">
                          {stat.clickCount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-32 bg-neutral-200 rounded-full h-2 mr-2 relative overflow-hidden">
                            <div
                              className="bg-primary-700 h-2 rounded-full absolute left-0 top-0"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-neutral-600">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {stat.lastClicked
                          ? formatDate(stat.lastClicked)
                          : "Never"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
