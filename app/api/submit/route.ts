import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAdminNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { scoreSubmission } from "@/lib/scoring";
import { submissionSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const limited = rateLimit(`submit:${ip}`);
  if (!limited.allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try later." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const scored = scoreSubmission(parsed.data);

  await prisma.submission.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      location: parsed.data.location,
      linkedin: parsed.data.linkedin,
      referral: parsed.data.referral,
      resumeUrl: parsed.data.resumeUrl,
      answers: parsed.data.answers,
      rubricScores: scored.scores,
      totalScore: scored.totalScore,
      flags: scored.flags,
      ipHash: crypto.createHash("sha256").update(ip).digest("hex"),
      userAgent: req.headers.get("user-agent") || undefined
    }
  });

  await sendAdminNotification(parsed.data.name, parsed.data.email, scored.totalScore);
  return NextResponse.json({ ok: true });
}
