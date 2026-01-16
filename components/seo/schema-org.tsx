/**
 * Schema.org JSON-LD components for SEO
 */

export interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
}

export function OrganizationSchema({
  name = "Team Aman Chawla",
  url = "https://teamamanchawla.com",
  logo,
  contactPoint,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name,
    url,
    ...(logo && { logo }),
    ...(contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        ...contactPoint,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface PropertySchemaProps {
  name: string;
  description?: string;
  type: string;
  price?: number;
  location?: string;
  image?: string;
  url: string;
}

export function PropertySchema({
  name,
  description,
  type,
  price,
  location,
  image,
  url,
}: PropertySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description && { description }),
    ...(image && {
      image,
    }),
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "INR",
      },
    }),
    ...(location && {
      areaServed: {
        "@type": "City",
        name: location,
      },
    }),
    category: type,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleSchemaProps {
  title: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = "Team Aman Chawla",
  url,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description && { description }),
    ...(image && { image }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Team Aman Chawla",
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
