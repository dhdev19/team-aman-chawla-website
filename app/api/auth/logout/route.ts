import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // NextAuth handles session invalidation on signOut
  return NextResponse.json({ success: true });
}
