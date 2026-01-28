import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = emailSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.emailSubscription.findUnique({
      where: { email: validatedData.email },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Email already subscribed",
        data: existing,
      });
    }

    // Create new subscription
    const subscription = await prisma.emailSubscription.create({
      data: {
        email: validatedData.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to updates",
      data: subscription,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    console.error("Error subscribing email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to subscribe. Please try again.",
      },
      { status: 500 }
    );
  }
}
