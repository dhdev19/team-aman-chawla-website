import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { blogSchema } from "@/lib/validations/blog";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const params = {
      search: searchParams.get("search") || undefined,
      published: searchParams.get("published") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "12",
    };

    const { page, limit, search, published } = params;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (published !== undefined) {
      where.published = published === "true";
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: blogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
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

    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}

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
        videoThumbnail: validatedData.videoThumbnail,
        metaTitle: validatedData.metaTitle,
        metaKeywords: validatedData.metaKeywords,
        metaDescription: validatedData.metaDescription,
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
