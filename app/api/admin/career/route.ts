import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { careerApplicationFilterSchema } from "@/lib/validations/career";
import { createPaginatedResponse, getSkip } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const filters = careerApplicationFilterSchema.parse({
      search: searchParams.get("search") || undefined,
      referralSource: searchParams.get("referralSource") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    });

    // Build where clause
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { city: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.referralSource) {
      where.referralSource = filters.referralSource;
    }

    const [total, data] = await Promise.all([
      prisma.careerApplication.count({ where }),
      prisma.careerApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: getSkip(filters.page, filters.limit),
        take: filters.limit,
      }),
    ]);

    const result = createPaginatedResponse(data, filters.page, filters.limit, total);

    return NextResponse.json({
      success: true,
      data: {
        data: result.data,
        pagination: result.pagination,
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

    console.error("Error fetching career applications:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch career applications",
      },
      { status: 500 }
    );
  }
}