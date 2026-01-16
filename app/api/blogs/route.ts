import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPaginatedResponse, getSkip } from "@/lib/pagination";
import { blogFilterSchema } from "@/lib/validations/blog";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      search: searchParams.get("search") || undefined,
      published: searchParams.get("published") || "true",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "12",
    };

    const validatedParams = blogFilterSchema.parse(params);
    const { page, limit, search, published } = validatedParams;

    const where: any = {
      published: published !== undefined ? published : true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.count({ where }),
    ]);

    const response = createPaginatedResponse(blogs, page, limit, total);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
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
