"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { videoApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/features/search-bar";
import { Pagination } from "@/components/features/pagination";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { ApiResponse, PaginatedResponse, Video } from "@/types";

export default function VideosListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<Video>>({
    queryKey: ["admin-videos", searchQuery, currentPage],
    queryFn: async () => {
      const response = (await videoApi.getAll()) as ApiResponse<Video[]>;
      let videos = response.data || [];

      // Client-side search and pagination
      if (searchQuery) {
        videos = videos.filter(
          (video: any) =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (video.description &&
              video.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      const total = videos.length;
      const startIndex = (currentPage - 1) * limit;
      const paginatedVideos = videos.slice(startIndex, startIndex + limit);

      return {
        data: paginatedVideos,
        pagination: {
          page: currentPage,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    },
  });

  const videos = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await videoApi.delete(id);
      refetch();
    } catch (error) {
      alert("Failed to delete video. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Videos</h1>
          <p className="text-neutral-600">
            Manage all your video listings
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/admin/videos/new")}
        >
          + Add Video
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search videos by title..."
          onSearch={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Videos Table */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Failed to load videos. Please try again later.
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-600 mb-4">No videos found</p>
          <Button
            variant="primary"
            onClick={() => router.push("/admin/videos/new")}
          >
            Add Your First Video
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
                      Thumbnail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Video Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {videos.map((video: any) => (
                    <tr key={video.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {video.thumbnail ? (
                          <div className="relative h-16 w-28 rounded overflow-hidden bg-neutral-200">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-28 rounded bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                            No Thumbnail
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {video.title}
                        </div>
                        {video.description && (
                          <div className="text-sm text-neutral-500 line-clamp-1">
                            {video.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={video.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-700 hover:underline truncate block max-w-xs"
                        >
                          {video.videoLink}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {video.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(video.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/videos/${video.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/videos/${video.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(video.id)}
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
