import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { getUserCredits, getCreditHistory } from "@/lib/credits";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [credits, history] = await Promise.all([
    getUserCredits(session.user.uid, session.user.email ?? undefined),
    getCreditHistory(session.user.uid),
  ]);

  return NextResponse.json({ credits, history });
}
