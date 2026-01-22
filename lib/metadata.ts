import { Metadata } from "next";

/**
 * Default site metadata
 */
export const defaultMetadata: Metadata = {
  title: {
    default: "Team Aman Chawla - Real Estate Properties",
    template: "%s | Team Aman Chawla",
  },
  description:
    "Discover premium residential, commercial, plot, and office properties with Team Aman Chawla. Your trusted real estate partner.",
  keywords: [
    "real estate",
    "properties",
    "residential",
    "commercial",
    "plots",
    "offices",
    "Team Aman Chawla",
  ],
  authors: [{ name: "Team Aman Chawla" }],
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Team Aman Chawla",
    title: "Team Aman Chawla - Real Estate Properties",
    description:
      "Discover premium residential, commercial, plot, and office properties with Team Aman Chawla.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Aman Chawla - Real Estate Properties",
    description:
      "Discover premium residential, commercial, plot, and office properties with Team Aman Chawla.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Generate metadata for property pages
 */
export function generatePropertyMetadata(property: {
  name: string;
  description?: string | null;
  type: string;
  location?: string | null;
  mainImage?: string | null;
}): Metadata {
  return {
    title: property.name,
    description:
      property.description ||
      `Explore ${property.name} - ${property.type} property${property.location ? ` in ${property.location}` : ""}. Contact Team Aman Chawla for more details.`,
    openGraph: {
      title: property.name,
      description:
        property.description ||
        `Explore ${property.name} - ${property.type} property${property.location ? ` in ${property.location}` : ""}.`,
      images: property.mainImage
        ? [
            {
              url: property.mainImage,
              alt: property.name,
            },
          ]
        : [],
    },
  };
}

/**
 * Generate metadata for blog pages
 */
export function generateBlogMetadata(blog: {
  title: string;
  excerpt?: string | null;
  image?: string | null;
}): Metadata {
  return {
    title: blog.title,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: blog.image
        ? [
            {
              url: blog.image,
              alt: blog.title,
            },
          ]
        : [],
      type: "article",
    },
  };
}

/**
 * Generate metadata for pages
 */
export function generatePageMetadata(
  title: string,
  description?: string,
  image?: string
): Metadata {
  return {
    title,
    description: description || title,
    openGraph: {
      title,
      description: description || title,
      images: image
        ? [
            {
              url: image,
              alt: title,
            },
          ]
        : [],
    },
  };
}
