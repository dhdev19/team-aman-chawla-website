import { PropertyType, PropertyStatus } from "@/constants";
import type { Prisma, Property as PrismaProperty } from "@prisma/client";

/**
 * Database Types (will be generated from Prisma later)
 * These are placeholder types until Prisma schema is set up
 */

export interface Property {
  id: string;
  name: string;
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

export type AdminProperty = PrismaProperty;
export type AdminPropertyWithConfig = Prisma.PropertyGetPayload<{
  include: { configurations: true };
}>;

export interface Video {
  id: string;
  title: string;
  videoLink: string;
  thumbnail: string | null;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Builder {
  id: string;
  name: string;
  about: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  type: string;
  propertyId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnquiryWithProperty extends Enquiry {
  property?: {
    id: string;
    name: string;
  } | null;
}

export interface TACRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerApplication {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  city: string;
  referralSource: string;
  referralOther: string | null;
  resumeLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageStat {
  id: string;
  pageName: string;
  clickCount: number;
  lastClicked: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
