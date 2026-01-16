import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tacRegistrationSchema } from "@/lib/validations/tac";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = tacRegistrationSchema.parse(body);

    const registration = await prisma.tACRegistration.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
      },
    });

    return NextResponse.json({
      success: true,
      data: registration,
      message: "Registration submitted successfully",
    });
  } catch (error: any) {
    console.error("Error creating TAC registration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit registration",
      },
      { status: 400 }
    );
  }
}
