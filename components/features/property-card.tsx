import Link from "next/link";
import Image from "next/image";
import { PropertyType, PropertyStatus } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  name: string;
  slug: string | null;
  type: PropertyType;
  builder: string;
  description: string | null;
  price: number | null;
  location: string | null;
  status: PropertyStatus;
  mainImage: string | null;
  images: string[];
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
          "group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300",
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
                "px-2 py-1 rounded-full text-xs font-semibold",
                property.status === "AVAILABLE" &&
                  "bg-green-500 text-white",
                property.status === "SOLD" && "bg-red-500 text-white",
                property.status === "RESERVED" && "bg-yellow-500 text-white"
              )}
            >
              {property.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600 capitalize">
              {property.type.replace("_", " ").toLowerCase()}
            </span>
            <span className="text-sm font-medium text-primary-700">
              {formatCurrency(property.price)}
            </span>
          </div>
          {property.builder && (
            <p className="text-sm text-neutral-500 mb-2">
              Builder: {property.builder}
            </p>
          )}
          {property.location && (
            <p className="text-sm text-neutral-500 flex items-center">
              <span className="mr-1">📍</span>
              {property.location}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
