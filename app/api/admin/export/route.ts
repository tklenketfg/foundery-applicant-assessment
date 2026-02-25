import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const submissions = await prisma.submission.findMany({ orderBy: { createdAt: "desc" } });

  const parser = new Parser({ fields: ["createdAt", "name", "email", "phone", "location", "totalScore", "status"] });
  const csv = parser.parse(submissions);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=submissions.csv"
    }
  });
}
