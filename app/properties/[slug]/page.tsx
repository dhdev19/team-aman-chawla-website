import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generatePropertyMetadata } from "@/lib/metadata";
import { PropertySchema } from "@/components/seo/schema-org";
import { PropertyImageSlider } from "@/components/features/property-image-slider";
import Image from "next/image";
import Link from "next/link";

async function getPropertyBySlug(slug: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { slug },
    });
    return property;
  } catch (error) {
    console.error("Error fetching property by slug:", error);
    return null;
  }
}

async function getRelatedProperties(
  currentId: string,
  type: string,
  limit: number = 3
) {
  try {
    const properties = await prisma.property.findMany({
      where: {
        id: { not: currentId },
        type: type as any,
        status: "AVAILABLE",
      },
      take: limit,
    });
    return properties;
  } catch (error) {
    console.error("Error fetching related properties:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return {
      title: "Property Not Found",
    };
  }
  return generatePropertyMetadata(property);
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const relatedProperties = await getRelatedProperties(
    property.id,
    property.type,
    3
  );

  const baseUrl = process.env.NEXTAUTH_URL || "https://teamamanchawla.com";
  const propertyUrl = `${baseUrl}/properties/${property.slug || property.id}`;

  return (
    <>
      <PropertySchema
        name={property.name}
        description={property.description || undefined}
        type={property.type}
        price={property.price || undefined}
        location={property.location || undefined}
        image={property.mainImage || undefined}
        url={propertyUrl}
      />
      <Navbar />
      <main className="min-h-screen">
        <Container className="py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-neutral-600">
            <Link href="/" className="hover:text-primary-700">
              Home
            </Link>
            {" / "}
            <Link href="/properties" className="hover:text-primary-700">
              Properties
            </Link>
            {" / "}
            <span className="text-neutral-900">{property.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Slider */}
              <PropertyImageSlider
                mainImage={property.mainImage}
                images={property.images || []}
                propertyName={property.name}
              />

              {/* Property Details */}
              <Card>
                <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                  {property.name}
                </h1>
                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
                    {property.type.replace("_", " ").toLowerCase()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : property.status === "SOLD"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                {property.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="text-neutral-700 whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-neutral-200">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Builder</p>
                    <p className="font-semibold text-neutral-900">
                      {property.builder}
                    </p>
                  </div>
                  {property.builderReraNumber && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">
                        Builder RERA Number
                      </p>
                      <p className="font-semibold text-neutral-900">
                        {property.builderReraNumber}
                      </p>
                    </div>
                  )}
                  {property.location && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Location</p>
                      <p className="font-semibold text-neutral-900">
                        {property.location}
                      </p>
                    </div>
                  )}
                  {property.price && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Price</p>
                      <p className="font-semibold text-primary-700 text-xl">
                        {formatCurrency(property.price)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Listed On</p>
                    <p className="font-semibold text-neutral-900">
                      {formatDate(property.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Location Advantages & Amenities */}
              {(property.locationAdvantages?.length || property.amenities?.length) && (
                <Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {property.locationAdvantages &&
                      property.locationAdvantages.length > 0 && (
                        <div>
                          <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                            Location Advantages
                          </h2>
                          <ul className="list-disc list-inside space-y-1 text-neutral-700">
                            {property.locationAdvantages.map((advantage, index) => (
                              <li key={index}>{advantage}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {property.amenities && property.amenities.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                          Amenities
                        </h2>
                        <ul className="list-disc list-inside space-y-1 text-neutral-700">
                          {property.amenities.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Bank Details */}
              {(property.bankAccountName ||
                property.bankName ||
                property.bankAccountNumber ||
                property.bankIfsc ||
                property.bankBranch) && (
                <Card>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                    Bank Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.bankAccountName && (
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">
                          Account Name
                        </p>
                        <p className="font-semibold text-neutral-900">
                          {property.bankAccountName}
                        </p>
                      </div>
                    )}
                    {property.bankName && (
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Bank Name</p>
                        <p className="font-semibold text-neutral-900">
                          {property.bankName}
                        </p>
                      </div>
                    )}
                    {property.bankAccountNumber && (
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">
                          Account Number
                        </p>
                        <p className="font-semibold text-neutral-900">
                          {property.bankAccountNumber}
                        </p>
                      </div>
                    )}
                    {property.bankIfsc && (
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">IFSC</p>
                        <p className="font-semibold text-neutral-900">
                          {property.bankIfsc}
                        </p>
                      </div>
                    )}
                    {property.bankBranch && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-neutral-600 mb-1">Branch</p>
                        <p className="font-semibold text-neutral-900">
                          {property.bankBranch}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Form Card */}
              <Card>
                <h2 className="text-xl font-semibold mb-4">
                  Interested in this property?
                </h2>
                <p className="text-neutral-600 mb-4">
                  Fill out the form below and we'll get back to you soon.
                </p>
                <Link href={`/contact?property=${property.id}`}>
                  <Button variant="primary" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </Card>

              {/* Related Properties */}
              {relatedProperties.length > 0 && (
                <Card>
                  <h2 className="text-xl font-semibold mb-4">
                    Similar Properties
                  </h2>
                  <div className="space-y-4">
                    {relatedProperties.map((related) => (
                      <Link
                        key={related.id}
                        href={`/properties/${related.slug || related.id}`}
                        className="block"
                      >
                        <div className="flex gap-4 hover:bg-neutral-50 p-2 rounded-lg transition-colors">
                          {related.mainImage && (
                            <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-neutral-200">
                              <Image
                                src={related.mainImage}
                                alt={related.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-neutral-900 truncate">
                              {related.name}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {formatCurrency(related.price)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

