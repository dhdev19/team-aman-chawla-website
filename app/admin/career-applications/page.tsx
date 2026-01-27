"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { careerApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { Pagination } from "@/components/features/pagination";
import { ReferralSource } from "@/lib/validations/career";
import { formatDate } from "date-fns";

export default function CareerApplicationsPage() {
  const [search, setSearch] = React.useState("");
  const [referralSource, setReferralSource] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, referralSource]);

  const { data, isLoading, error, refetch } = useQuery<{
    success: boolean;
    data: {
      data: any[];
      pagination: any;
    };
  }>({
    queryKey: ["admin-career-applications", debouncedSearch, referralSource, currentPage],
    queryFn: async (): Promise<{
      success: boolean;
      data: {
        data: any[];
        pagination: any;
      };
    }> => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
      };
      
      if (debouncedSearch) params.search = debouncedSearch;
      if (referralSource) params.referralSource = referralSource;

      const response = await careerApi.getAll(params);
      return response.data as {
        success: boolean;
        data: {
          data: any[];
          pagination: any;
        };
      };
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career application?")) return;
    
    try {
      await careerApi.delete(id);
      refetch();
    } catch (error) {
      alert("Failed to delete career application");
    }
  };

  const referralSourceOptions = [
    { value: "", label: "All Sources" },
    { value: ReferralSource.FAMILY_FRIENDS, label: "Family/Friends" },
    { value: ReferralSource.WEBSITE, label: "Website" },
    { value: ReferralSource.YOUTUBE, label: "YouTube" },
    { value: ReferralSource.ADVERTISEMENT, label: "Advertisement" },
    { value: ReferralSource.OTHER, label: "Other" },
  ];

  const getReferralSourceLabel = (source: string) => {
    const option = referralSourceOptions.find(opt => opt.value === source);
    return option ? option.label : source;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load career applications</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Career Applications
        </h1>
        <p className="text-neutral-600">Manage career applications and job inquiries</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Search
            </label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or city..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Referral Source
            </label>
            <Select
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
            >
              {referralSourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setReferralSource("");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Applications List */}
      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : !data?.data || data.data.data.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-neutral-500 mb-4">No career applications found</p>
          {(debouncedSearch || referralSource) && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setReferralSource("");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="grid gap-6">
            {data.data.data.map((application: any) => (
              <Card key={application.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {application.name}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                        {getReferralSourceLabel(application.referralSource)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Email</p>
                        <p className="text-sm text-neutral-600">{application.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">WhatsApp</p>
                        <p className="text-sm text-neutral-600">{application.whatsappNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">City</p>
                        <p className="text-sm text-neutral-600">{application.city}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Applied</p>
                        <p className="text-sm text-neutral-600">
                          {formatDate(new Date(application.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    {application.referralOther && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-neutral-700">Other Source</p>
                        <p className="text-sm text-neutral-600">{application.referralOther}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <a
                        href={application.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-700 hover:text-primary-800 text-sm font-medium"
                      >
                        View Resume →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/admin/career-applications/${application.id}`}>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(application.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.data.pagination && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={data.data.pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}