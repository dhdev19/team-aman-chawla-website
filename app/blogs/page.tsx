"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/features/search-bar";
import { Pagination } from "@/components/features/pagination";
import { LoadingSpinner } from "@/components/ui/loading";
import { blogApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { formatDate, truncate } from "@/lib/utils";
import { FadeIn } from "@/components/animations";
import Link from "next/link";
import Image from "next/image";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", searchQuery, currentPage],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
        published: "true",
      };
      if (searchQuery) params.search = searchQuery;

      const response = await blogApi.getAll(params);
      return response.data;
    },
  });

  const blogs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-primary-700 text-white py-12">
          <Container>
            <FadeIn>
              <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
              <p className="text-lg text-primary-100">
                Stay updated with the latest real estate news, tips, and insights
              </p>
            </FadeIn>
          </Container>
        </div>

        <Container className="py-12">
          {/* Search */}
          <div className="mb-8">
            <SearchBar
              placeholder="Search blog posts..."
              onSearch={(query) => {
                setSearchQuery(query);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Blog Grid */}
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              Failed to load blog posts. Please try again later.
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-600 mb-4">No blog posts found</p>
              <p className="text-neutral-500">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {blogs.map((blog: any) => (
                  <FadeIn key={blog.id} delay={0.1}>
                    <Link href={`/blogs/${blog.slug}`}>
                      <Card
                        variant="elevated"
                        className="h-full hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                      >
                        {blog.type === "TEXT" && blog.image && (
                          <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                            <Image
                              src={blog.image}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {blog.type === "VIDEO" && blog.videoUrl && (
                          blog.videoThumbnail ? (
                            <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                              <Image
                                src={blog.videoThumbnail}
                                alt={blog.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all">
                                <i className="fa-solid fa-play-circle text-white text-5xl drop-shadow-lg"></i>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                VIDEO
                              </div>
                            </div>
                          ) : (
                            <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <i className="fa-solid fa-play-circle text-white text-6xl"></i>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                VIDEO
                              </div>
                            </div>
                          )
                        )}
                        <div className="p-6">
                          <div className="text-sm text-neutral-500 mb-2">
                            {formatDate(blog.createdAt)}
                          </div>
                          <h2 className="text-xl font-semibold text-neutral-900 mb-3 line-clamp-2">
                            {blog.title}
                          </h2>
                          {blog.excerpt && (
                            <p className="text-neutral-600 mb-4 line-clamp-3">
                              {blog.excerpt}
                            </p>
                          )}
                          <span className="text-primary-700 font-medium hover:underline">
                            {blog.type === "VIDEO" ? "Watch Video →" : "Read More →"}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </FadeIn>
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
