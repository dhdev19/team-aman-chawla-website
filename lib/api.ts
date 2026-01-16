import { ApiResponse } from "@/types";

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Base API client configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Generic API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: response.statusText,
      }));
      throw new ApiError(
        errorData.error || errorData.message || "An error occurred",
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      500
    );
  }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: "GET",
  });
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function apiPut<T>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: "DELETE",
  });
}

/**
 * Upload file (multipart/form-data)
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: response.statusText,
      }));
      throw new ApiError(
        errorData.error || errorData.message || "Upload failed",
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Upload failed",
      500
    );
  }
}
