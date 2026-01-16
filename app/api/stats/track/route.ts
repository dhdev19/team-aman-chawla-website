import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageName } = body;

    if (!pageName || typeof pageName !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Page name is required",
        },
        { status: 400 }
      );
    }

    const pageStat = await prisma.pageStat.upsert({
      where: { pageName },
      update: {
        clickCount: { increment: 1 },
        lastClicked: new Date(),
      },
      create: {
        pageName,
        clickCount: 1,
        lastClicked: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: pageStat,
    });
  } catch (error: any) {
    console.error("Error tracking page stat:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to track page stat",
      },
      { status: 500 }
    );
  }
}
