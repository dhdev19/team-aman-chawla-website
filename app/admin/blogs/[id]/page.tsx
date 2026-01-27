"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { blogApi } from "@/lib/api-client";
import { apiGet, apiDelete, apiPut } from "@/lib/api";
import { ApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function BlogViewPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const { data: blog, isLoading, error, refetch } = useQuery<ApiResponse<any>>({
    queryKey: ["admin-blog", blogId],
    queryFn: async (): Promise<ApiResponse<any>> => {
      const response = await apiGet(`/api/admin/blogs/${blogId}`);
      return response;
    },
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }

    try {
      await apiDelete(`/api/admin/blogs/${blogId}`);
      router.push("/admin/blogs");
    } catch (error) {
      alert("Failed to delete blog post. Please try again.");
    }
  };

  const handleTogglePublish = async () => {
    if (!blog) return;

    try {
      const blogData = blog.data;
      await apiPut(`/api/admin/blogs/${blogId}`, {
        ...blogData,
        published: !blogData.published,
      });
      refetch();
    } catch (error) {
      alert("Failed to update blog post. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !blog) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load blog post</p>
        <Button variant="primary" onClick={() => router.push("/admin/blogs")}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  const blogData = blog as any;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {blogData.title}
          </h1>
          <p className="text-neutral-600">View blog post details</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/blogs/${blogData.id}/edit`}>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button
            variant={blogData.published ? "secondary" : "primary"}
            onClick={handleTogglePublish}
          >
            {blogData.published ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {blogData.image && (
            <Card>
              <div className="relative h-96 w-full rounded-lg overflow-hidden bg-neutral-200">
                <Image
                  src={blogData.image}
                  alt={blogData.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          )}

          {/* Blog Content */}
          <Card>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    blogData.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {blogData.published ? "Published" : "Draft"}
                </span>
                <span className="text-sm text-neutral-500">
                  Created: {formatDate(blogData.createdAt)}
                </span>
              </div>
              {blogData.excerpt && (
                <p className="text-lg text-neutral-600 italic mb-4">
                  {blogData.excerpt}
                </p>
              )}
            </div>

            <div
              className="prose prose-lg max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{ __html: blogData.content }}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Title
                </label>
                <p className="mt-1 text-neutral-900">{blogData.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Slug
                </label>
                <p className="mt-1 text-neutral-900 font-mono text-sm">
                  /blogs/{blogData.slug}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      blogData.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {blogData.published ? "Published" : "Draft"}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Created At
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatDate(blogData.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Updated At
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatDate(blogData.updatedAt)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <Link href={`/admin/blogs/${blogData.id}/edit`} className="block">
                <Button variant="primary" className="w-full">
                  Edit Blog Post
                </Button>
              </Link>
              <Button
                variant={blogData.published ? "secondary" : "primary"}
                className="w-full"
                onClick={handleTogglePublish}
              >
                {blogData.published ? "Unpublish" : "Publish"}
              </Button>
              {blogData.published && (
                <Link href={`/blogs/${blogData.slug}`} className="block">
                  <Button variant="ghost" className="w-full">
                    View Public Page
                  </Button>
                </Link>
              )}
              <Button
                variant="danger"
                className="w-full"
                onClick={handleDelete}
              >
                Delete Blog Post
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
