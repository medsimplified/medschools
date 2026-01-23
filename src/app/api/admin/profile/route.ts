import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
export async function GET() {
  const admin = await prisma.admin.findFirst();
  return NextResponse.json(admin);
}

export async function PUT(req: Request) {
  const data = await req.json();
  const admin = await prisma.admin.findFirst();
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data, // <-- this object may contain empty strings
  });
  return NextResponse.json(updated);
}