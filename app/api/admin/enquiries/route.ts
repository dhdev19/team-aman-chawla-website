import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createPaginatedResponse, getSkip } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    const type = searchParams.get("type") || undefined;

    const where: any = {};
    if (type) {
      where.type = type;
    }

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.enquiry.count({ where }),
    ]);

    const response = createPaginatedResponse(enquiries, page, limit, total);

    return NextResponse.json({
      success: true,
      data: response,
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

    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch enquiries",
      },
      { status: 500 }
    );
  }
}
