"use client";

import { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiUpload, ApiError } from "./api";
import { useSession } from "next-auth/react";

/**
 * Client-side API utilities with authentication
 */

/**
 * Get auth headers for authenticated requests
 */
function getAuthHeaders(): HeadersInit {
  // In a real app, you might get the token from the session
  // For now, NextAuth handles this via cookies
  return {};
}

/**
 * Property API endpoints
 */
export const propertyApi = {
  getAll: (params?: Record<string, any>) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiGet(`/api/properties${queryString}`);
  },
  getById: (id: string) => apiGet(`/api/properties/${id}`),
  create: (data: any) => apiPost("/api/admin/properties", data),
  update: (id: string, data: any) => apiPut(`/api/admin/properties/${id}`, data),
  delete: (id: string) => apiDelete(`/api/admin/properties/${id}`),
};

/**
 * Video API endpoints
 */
export const videoApi = {
  getAll: () => apiGet("/api/videos"),
  getById: (id: string) => apiGet(`/api/videos/${id}`),
  create: (data: any) => apiPost("/api/admin/videos", data),
  update: (id: string, data: any) => apiPut(`/api/admin/videos/${id}`, data),
  delete: (id: string) => apiDelete(`/api/admin/videos/${id}`),
};

/**
 * Enquiry API endpoints
 */
export const enquiryApi = {
  create: (data: any) => apiPost("/api/enquiries", data),
  getAll: () => apiGet("/api/admin/enquiries"),
  markAsRead: (id: string) => apiPatch(`/api/admin/enquiries/${id}`, { read: true }),
  delete: (id: string) => apiDelete(`/api/admin/enquiries/${id}`),
};

/**
 * TAC Registration API endpoints
 */
export const tacApi = {
  create: (data: any) => apiPost("/api/tac-registration", data),
  getAll: () => apiGet("/api/admin/tac-registrations"),
};

/**
 * Blog API endpoints
 */
export const blogApi = {
  getAll: (params?: Record<string, any>) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiGet(`/api/blogs${queryString}`);
  },
  getById: (id: string) => apiGet(`/api/admin/blogs/${id}`),
  getBySlug: (slug: string) => apiGet(`/api/blogs/${slug}`),
  create: (data: any) => apiPost("/api/admin/blogs", data),
  update: (id: string, data: any) => apiPut(`/api/admin/blogs/${id}`, data),
  delete: (id: string) => apiDelete(`/api/admin/blogs/${id}`),
};

/**
 * Stats API endpoints
 */
export const statsApi = {
  trackClick: (pageName: string) => apiPost("/api/stats/track", { pageName }),
  getAll: () => apiGet("/api/admin/stats"),
};

/**
 * Upload API endpoints
 */
export const uploadApi = {
  uploadImage: (
    file: File,
    options?: {
      slug?: string;
      imageType?: "main" | "slider";
      index?: number;
    }
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.slug) {
      formData.append("slug", options.slug);
    }
    if (options?.imageType) {
      formData.append("imageType", options.imageType);
    }
    if (options?.index !== undefined) {
      formData.append("index", options.index.toString());
    }
    return apiUpload<{ url: string; fileName: string }>("/api/admin/upload", formData);
  },
};

/**
 * Email Subscription API endpoints
 */
export const emailSubscriptionApi = {
  subscribe: (email: string) => apiPost("/api/email-subscription", { email }),
};

export { ApiError };
