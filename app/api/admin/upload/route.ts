import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const slug = formData.get("slug") as string | null;
    const imageType = formData.get("imageType") as string | null; // "main" or "slider"
    const index = formData.get("index") as string | null; // For slider images: "1", "2", etc.

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only images are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds 5MB limit",
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate filename based on slug and image type
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    let fileName: string;

    if (slug && imageType) {
      // Use slug-based naming
      const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      if (imageType === "main") {
        fileName = `${sanitizedSlug}-main.${fileExtension}`;
      } else if (imageType === "slider" && index) {
        fileName = `${sanitizedSlug}-${index}.${fileExtension}`;
      } else {
        // Fallback to timestamp-based naming if parameters are invalid
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        fileName = `${timestamp}-${randomString}.${fileExtension}`;
      }
    } else {
      // Fallback to timestamp-based naming if slug/imageType not provided
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      fileName = `${timestamp}-${randomString}.${fileExtension}`;
    }

    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        fileName,
      },
      message: "File uploaded successfully",
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.message?.includes("Forbidden")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
