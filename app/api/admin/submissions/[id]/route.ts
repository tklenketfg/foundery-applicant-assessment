import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const status = String(form.get("status") || "NEW");
  const adminNotes = String(form.get("adminNotes") || "");

  await prisma.submission.update({
    where: { id: params.id },
    data: { status: status as any, adminNotes }
  });

  return NextResponse.redirect(new URL(`/admin/${params.id}`, req.url));
}
