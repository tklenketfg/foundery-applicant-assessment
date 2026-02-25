import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function sign(value: string) {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionToken() {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(token?: string) {
  if (!token?.includes(".")) return false;
  const [payload, sig] = token.split(".");
  return sign(payload) === sig;
}

export function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidSession(token);
}

export const adminCookieName = COOKIE_NAME;
