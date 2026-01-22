import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { blogSchema } from "@/lib/validations/blog";
import { generateSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = blogSchema.parse(body);

    // Generate slug if not provided
    const slug = validatedData.slug || generateSlug(validatedData.title);

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,
          error: "A blog with this slug already exists",
        },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title: validatedData.title,
        slug,
        type: validatedData.type,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        image: validatedData.image,
        videoUrl: validatedData.videoUrl,
        published: validatedData.published,
      },
    });

    return NextResponse.json({
      success: true,
      data: blog,
      message: "Blog created successfully",
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

    console.error("Error creating blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create blog",
      },
      { status: 400 }
    );
  }
}
