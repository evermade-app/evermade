import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  const nets = os.networkInterfaces();
  for (const ifaces of Object.values(nets)) {
    for (const iface of (ifaces ?? [])) {
      if (iface.family === "IPv4" && !iface.internal) {
        return NextResponse.json({ ip: iface.address });
      }
    }
  }
  return NextResponse.json({ ip: null });
}
