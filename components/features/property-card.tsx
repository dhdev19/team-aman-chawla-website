import Link from "next/link";
import Image from "next/image";
import { PropertyType, PropertyFormat, PropertyStatus } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

interface Property {
  id: string;
  name: string;
  slug: string | null;
  type: PropertyType;
  format: PropertyFormat | null;
  builder: string;
  description: string | null;
  price: number | null; // Float? from database
  location: string | null;
  locationAdvantages: string[];
  status: PropertyStatus;
  mainImage: string | null;
  images: string[];
  amenities: string[];
  mapImage: string | null;
  projectLaunchDate: Date | null;
  builderReraQrCode: string | null;
  possession: string | null;
  metaTitle: string | null;
  metaKeywords: string | null;
  metaDescription: string | null;
  bankAccountName: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankIfsc: string | null;
  bankBranch: string | null;
  configurations?: Array<{ configType: string }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.slug || property.id}`}>
      <Card
        variant="elevated"
        className={cn(
          "group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 property-card-new-launch",
          className
        )}
      >
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden bg-neutral-200">
          {property.mainImage ? (
            <Image
              src={property.mainImage}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              No Image
            </div>
          )}
          {/* RERA details */}
          <div className="absolute top-2 right-2 bg-white/90 text-neutral-900 rounded-md px-2 py-1 text-[10px] leading-tight shadow flex gap-2">
            <div className="flex items-center">
              {property.builderReraQrCode ? (
                <Image
                  src={property.builderReraQrCode}
                  alt="RERA QR"
                  width={48}
                  height={48}
                  className="rounded"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-neutral-200 text-neutral-500 flex items-center justify-center text-[9px]">
                  RERA QR
                </div>
              )}
            </div>
            <div className="rera-details-text rera-details-text-local text-[9px] normal-case">
              {property.builderReraNumber && (
                <div className="text-[10px] font-semibold">
                  Project RERA: {property.builderReraNumber}
                </div>
              )}
              <div className="text-[8px]">Rera website: www.up-rera.in</div>
              <div className="text-[8px]">Authorised Channel Partner: Aman Chawla</div>
              <div className="text-[8px]">RERA Number: UPRERAAGT11258</div>
            </div>
          </div>
          {(property.bankAccountName ||
            property.bankName ||
            property.bankAccountNumber ||
            property.bankIfsc ||
            property.bankBranch) && (
            <div className="absolute left-2 right-2 bottom-2 bg-white/90 text-neutral-900 rounded-md px-2 pt-0.5 pb-1 text-[9px] leading-tight shadow bank-details-text-local normal-case">
              <div>
                {[
                  property.bankAccountName ? `Account Name: ${property.bankAccountName}` : null,
                  property.bankAccountNumber
                    ? `A/C No.: ${property.bankAccountNumber}`
                    : null,
                  property.bankName ? `Bank Name: ${property.bankName}` : null,
                  property.bankIfsc ? `IFSC Code: ${property.bankIfsc}` : null,
                  property.bankBranch ? `Branch: ${property.bankBranch}` : null,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </div>
              <div className="text-[8px]">
                That Money from customer must be deposited in Collection A/c only.
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-2">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
            {property.name}
          </h3>
          {property.builder && (
            <p className="text-sm text-neutral-500 mb-2">
              by {property.builder}
            </p>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-neutral-600 capitalize">
              {property.type.replace("_", " ").toLowerCase()}
            </span>
            <span className="text-sm font-medium text-primary-700">
              {property.price ? formatIndianCurrency(property.price) : "Price on Request"}*
            </span>
          </div>
          
          {property.location && (
            <p className="text-sm text-neutral-500 flex items-center">
              <span className="mr-1"><i className="fa-solid fa-map-location-dot"></i></span>
              {property.location}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
