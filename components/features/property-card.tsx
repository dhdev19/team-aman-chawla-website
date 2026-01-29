import Link from "next/link";
import Image from "next/image";
import { PropertyType, PropertyFormat, PropertyStatus } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
        <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
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
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-semibold capitalize",
                property.status === "AVAILABLE" &&
                  "bg-green-500 text-white",
                property.status === "SOLD" && "bg-red-500 text-white",
                property.status === "RESERVED" && "bg-yellow-500 text-white",
                (property.status as string) === "NEW_LAUNCH" && "bg-blue-500 text-white"
              )}
            >
              {property.status.replace("_", " ").toLowerCase()}
            </span>
          </div>
          {/* Property Type Badge */}
          <div className="absolute top-2 left-2">
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: "#005ba1" }}
            >
              {property.type.replace("_", " ").charAt(0).toUpperCase() + property.type.replace("_", " ").slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
            {property.name}
          </h3>
          {property.builder && (
            <p className="text-sm text-neutral-500 mb-2">
              by {property.builder}
            </p>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">
              {property.configurations && property.configurations.length > 0 && (
                <span className="font-normal">
                  {[...new Set(property.configurations.map(c => c.configType.toUpperCase()))].join(", ")}
                </span>
              )}
            </span>
            <span className="text-sm font-medium text-primary-700">
              {formatCurrency(property.price)}
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
