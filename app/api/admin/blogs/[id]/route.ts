import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { blogSchema } from "@/lib/validations/blog";
import { generateSlug } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
    });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
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

    console.error("Error fetching blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = blogSchema.parse(body);

    // Check if slug is being changed and if it conflicts
    if (validatedData.slug) {
      const existingBlog = await prisma.blog.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingBlog && existingBlog.id !== params.id) {
        return NextResponse.json(
          {
            success: false,
            error: "A blog with this slug already exists",
          },
          { status: 400 }
        );
      }
    }

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        image: validatedData.image,
        published: validatedData.published,
      },
    });

    return NextResponse.json({
      success: true,
      data: blog,
      message: "Blog updated successfully",
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

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    console.error("Error updating blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update blog",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    await prisma.blog.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
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

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    console.error("Error deleting blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete blog",
      },
      { status: 500 }
    );
  }
}
