import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
  res.cookies.set(adminCookieName, "", { maxAge: 0, path: "/" });
  return res;
}
