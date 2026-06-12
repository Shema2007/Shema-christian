import { type Request, type Response, type NextFunction } from "express";
import { createHmac } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret";
const COOKIE_NAME = "admin_session";
const MAX_AGE_MS = 1000 * 60 * 60 * 8; // 8 hours

function sign(value: string): string {
  const sig = createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
  return `${value}.${sig}`;
}

function unsign(signed: string): string | null {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  const expected = sign(value);
  return expected === signed ? value : null;
}

export function createAdminSession(res: Response): void {
  const payload = `admin:${Date.now()}`;
  const token = sign(payload);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_MS,
  });
}

export function clearAdminSession(res: Response): void {
  res.clearCookie(COOKIE_NAME);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }
  const value = unsign(token);
  if (!value) { res.status(401).json({ error: "Unauthorized" }); return; }
  const [, tsStr] = value.split(":");
  const ts = parseInt(tsStr, 10);
  if (Date.now() - ts > MAX_AGE_MS) { res.status(401).json({ error: "Session expired" }); return; }
  next();
}
