import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}${ROUTES.ABOUT}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}${ROUTES.PROPERTIES}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${ROUTES.BLOGS}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}${ROUTES.ENQUIRY}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}${ROUTES.CONTACT}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}${ROUTES.TAC_REGISTRATION}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}${ROUTES.REFER}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    // Dynamic property pages
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    });

    const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.id}`,
      lastModified: property.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic blog pages
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...propertyPages, ...blogPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
