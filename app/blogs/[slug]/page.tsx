import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { generateBlogMetadata } from "@/lib/metadata";
import { ArticleSchema } from "@/components/seo/schema-org";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

async function getBlog(slug: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

async function getRelatedBlogs(currentSlug: string, limit: number = 3) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        slug: { not: currentSlug },
        published: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }
  return generateBlogMetadata(blog);
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || !blog.published) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.slug, 3);
  const baseUrl = process.env.NEXTAUTH_URL || "https://teamamanchawla.com";
  const blogUrl = `${baseUrl}/blogs/${blog.slug}`;

  return (
    <>
      <ArticleSchema
        title={blog.title}
        description={blog.excerpt || undefined}
        image={blog.image || undefined}
        datePublished={blog.createdAt.toISOString()}
        dateModified={blog.updatedAt.toISOString()}
        url={blogUrl}
      />
      <Navbar />
      <main className="min-h-screen blog-detail-page">
        <Container className="py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-neutral-600">
            <Link href="/" className="hover:text-primary-700">
              Home
            </Link>
            {" / "}
            <Link href="/blogs" className="hover:text-primary-700">
              Blogs
            </Link>
            {" / "}
            <span className="text-neutral-900">{blog.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-2">
              <Card>
                {blog.image && (
                  <div className="relative h-96 w-full rounded-lg overflow-hidden bg-neutral-200 mb-8">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-sm text-neutral-500 mb-4">
                    Published on {formatDate(blog.createdAt, "dd MMMM yyyy")}
                  </div>
                  <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                    {blog.title}
                  </h1>
                  {blog.excerpt && (
                    <p className="text-xl text-neutral-600 italic">
                      {blog.excerpt}
                    </p>
                  )}
                </div>

                <div
                  className="prose prose-lg max-w-none text-neutral-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </Card>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Related Blogs */}
              {relatedBlogs.length > 0 && (
                <Card>
                  <h2 className="text-xl font-semibold mb-4">Related Posts</h2>
                  <div className="space-y-4">
                    {relatedBlogs.map((related) => (
                      <Link
                        key={related.id}
                        href={`/blogs/${related.slug}`}
                        className="block"
                      >
                        <div className="flex gap-4 hover:bg-neutral-50 p-2 rounded-lg transition-colors">
                          {related.image && (
                            <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-neutral-200">
                              <Image
                                src={related.image}
                                alt={related.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-neutral-900 truncate mb-1">
                              {related.title}
                            </h3>
                            <p className="text-xs text-neutral-500">
                              {formatDate(related.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              {/* CTA Card */}
              <Card variant="elevated" className="bg-primary-50 border-primary-200">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Looking for a Property?
                </h3>
                <p className="text-sm text-neutral-700 mb-4">
                  Browse our extensive collection of properties and find your
                  perfect match.
                </p>
                <Link href="/properties">
                  <button className="w-full px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 transition-colors font-medium">
                    View Properties
                  </button>
                </Link>
              </Card>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
