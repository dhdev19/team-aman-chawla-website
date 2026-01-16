"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { blogApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/features/search-bar";
import { FilterDropdown } from "@/components/features/filter-dropdown";
import { Pagination } from "@/components/features/pagination";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate, truncate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const publishedStatusOptions = [
  { value: "", label: "All" },
  { value: "true", label: "Published" },
  { value: "false", label: "Draft" },
];

export default function BlogsListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [publishedFilter, setPublishedFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 12;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-blogs", searchQuery, publishedFilter, currentPage],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };
      if (searchQuery) params.search = searchQuery;
      if (publishedFilter) params.published = publishedFilter;

      const response = await blogApi.getAll(params);
      return response.data;
    },
  });

  const blogs = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      await blogApi.delete(id);
      refetch();
    } catch (error) {
      alert("Failed to delete blog post. Please try again.");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const blog = blogs.find((b: any) => b.id === id);
      if (!blog) return;

      await blogApi.update(id, {
        ...blog,
        published: !currentStatus,
      });
      refetch();
    } catch (error) {
      alert("Failed to update blog post. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Blogs</h1>
          <p className="text-neutral-600">
            Manage all your blog posts
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/admin/blogs/new")}
        >
          + Add Blog Post
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SearchBar
            placeholder="Search blogs by title..."
            onSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
          />
        </div>
        <FilterDropdown
          label="Status"
          options={publishedStatusOptions}
          value={publishedFilter}
          onChange={(value) => {
            setPublishedFilter(value);
            setCurrentPage(1);
          }}
          placeholder="All"
        />
      </div>

      {/* Blogs Table */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Failed to load blogs. Please try again later.
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-600 mb-4">No blog posts found</p>
          <Button
            variant="primary"
            onClick={() => router.push("/admin/blogs/new")}
          >
            Add Your First Blog Post
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
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
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
                  {blogs.map((blog: any) => (
                    <tr key={blog.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {blog.image ? (
                          <div className="relative h-16 w-24 rounded overflow-hidden bg-neutral-200">
                            <Image
                              src={blog.image}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-24 rounded bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {blog.title}
                        </div>
                        {blog.excerpt && (
                          <div className="text-sm text-neutral-500 line-clamp-1">
                            {truncate(blog.excerpt, 60)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        /blogs/{blog.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(blog.id, blog.published)}
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            blog.published
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {blog.published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/blogs/${blog.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/blogs/${blog.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(blog.id)}
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
