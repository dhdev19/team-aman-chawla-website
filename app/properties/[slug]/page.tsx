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
import { PropertyContactForm } from "@/components/features/property-contact-form";
import { LoanCalculator } from "@/components/features/loan-calculator";
import {
  PropertyConfigCarousel,
  type PropertyConfiguration,
} from "@/components/features/property-config-carousel";
import { PropertyStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

// Currency converter for Lakhs and Crores
const formatIndianCurrency = (price: number) => {
  if (price >= 10000000) {
    // Crores
    const cr = price / 10000000;
    return `${cr.toFixed(2)} Cr`;
  } else if (price >= 100000) {
    // Lakhs
    const lac = price / 100000;
    return `${lac.toFixed(2)} Lacs`;
  } else {
    // Regular format for smaller amounts
    return formatCurrency(price);
  }
};

async function getPropertyBySlug(slug: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        configurations: true,
      },
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
        status: {
          in: [PropertyStatus.AVAILABLE, "NEW_LAUNCH" as PropertyStatus, PropertyStatus.RESERVED],
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
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

  const builder = await prisma.builder.findUnique({
    where: { name: property.builder },
  });

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

          {/* Image Banner */}
          <div className="mb-8">
            <PropertyImageSlider
              mainImage={property.mainImage}
              images={property.images || []}
              propertyName={property.name}
              builderReraNumber={property.builderReraNumber}
              builderReraQrCode={property.builderReraQrCode}
              bankAccountName={property.bankAccountName}
              bankName={property.bankName}
              bankAccountNumber={property.bankAccountNumber}
              bankIfsc={property.bankIfsc}
              bankBranch={property.bankBranch}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {property.description && (
                <Card>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-neutral-700 whitespace-pre-line">
                    {property.description}
                  </p>
                </Card>
              )}

              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                    Amenities
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-700">
                    {property.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-0.5" style={{ color: "#005ba1" }}>
                          <i className="fa-solid fa-check"></i>
                        </span>
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <Card>
                <div className="flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
                      /[^0-9]/g,
                      ""
                    )}?text=${encodeURIComponent(
                      `I want to know more about ${property.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Enquire Now
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
                      /[^0-9]/g,
                      ""
                    )}?text=${encodeURIComponent(
                      `I want to know more about ${property.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" className="w-full">
                      Download Brochure
                    </Button>
                  </a>
                </div>
              </Card>

              {/* Pricing & Configurations */}
              {property.configurations && property.configurations.length > 0 && (
                <Card>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                    Pricing & Configurations
                  </h2>
                  <PropertyConfigCarousel
                    configurations={
                      property.configurations as PropertyConfiguration[]
                    }
                  />
                </Card>
              )}

              {property.locationAdvantages &&
                property.locationAdvantages.length > 0 && (
                  <Card>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                      Location Advantages
                    </h2>
                    <ul className="space-y-2 text-neutral-700">
                      {property.locationAdvantages.map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary-700 mt-0.5">
                            <i className="fa-solid fa-location-dot"></i>
                          </span>
                          <span>{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

              {property.mapImage && (
                <Card>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                    Location Map
                  </h2>
                  <div className="relative w-full rounded bg-neutral-200 border border-neutral-300">
                    <Image
                      src={property.mapImage}
                      alt="Location Map"
                      width={1200}
                      height={600}
                      className="w-full h-auto"
                    />
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
              {builder?.about && (
                <Card>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                    About {builder.name}
                  </h2>
                  <p className="text-neutral-700 whitespace-pre-line">
                    {builder.about}
                  </p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                      {property.builderReraQrCode ? (
                        <Image
                          src={property.builderReraQrCode}
                          alt="Builder RERA QR Code"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-500">
                          RERA QR
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-neutral-900">
                        {property.name}
                      </div>
                      <div className="text-sm text-neutral-600">
                        by {property.builder}
                      </div>
                      <div className="pt-1 text-sm text-neutral-600">
                        <span className="font-semibold text-neutral-900">
                          {property.price
                            ? `₹ ${formatIndianCurrency(property.price)}* onwards`
                            : "Price on Request"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-neutral-700">
                    {property.location && (
                      <div className="text-sm text-neutral-600 flex items-center gap-1">
                        <span className="text-neutral-600">
                          <i className="fa-solid fa-location-dot"></i>
                        </span>
                        <span className="font-semibold text-neutral-900">
                          {property.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-neutral-700">
                    <div className="text-sm text-neutral-600">Project RERA</div>
                    <div className="font-semibold text-neutral-900">
                      {property.builderReraNumber || "-"}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Channel Partner RERA
                    </div>
                    <div className="font-semibold text-neutral-900">
                      <span className="font-semibold text-neutral-900">
                        UPRERAAGT11258
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="space-y-3">
                  <div className="text-sm text-neutral-600">Property Details</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
                      {property.type.replace("_", " ").toLowerCase()}
                    </span>
                    {property.format && (
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium capitalize">
                        {property.format.replace("_", " ").toLowerCase()}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        property.status === PropertyStatus.AVAILABLE
                          ? "bg-green-100 text-green-700"
                          : property.status === PropertyStatus.SOLD
                          ? "bg-red-100 text-red-700"
                          : property.status === PropertyStatus.RESERVED
                          ? "bg-yellow-100 text-yellow-700"
                          : (property.status as string) === "NEW_LAUNCH"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-black text-white"
                      }`}
                    >
                      {property.status.replace("_", " ").toLowerCase()}
                    </span>
                  </div>
                  {property.possession && (
                    <div className="text-sm text-neutral-600">
                      Possession:{" "}
                      <span className="font-semibold text-neutral-900">
                        {property.possession}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              {/* Contact Form Card */}
              <Card>
                <PropertyContactForm
                  propertyId={property.id}
                  propertyName={property.name}
                  propertyPrice={property.price || undefined}
                />
              </Card>

              {/* Loan Calculator */}
              <Card>
                <LoanCalculator propertyPrice={property.price || 5000000} />
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
                            <p className="text-sm text-neutral-600 normal-case similar-price-text-local">
                              {related.price
                                ? formatIndianCurrency(related.price) + " onwards"
                                : "Price on Request"}
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

