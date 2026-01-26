import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export type AuthRole = "me" | "her" | "guest";
export type AuthToken = {
  role: AuthRole;
  roomId: string;
};

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

export const signToken = (payload: AuthToken) => {
  return jwt.sign(payload, secret, { expiresIn: "30d" });
};

export const verifyToken = (token: string): AuthToken | null => {
  try {
    return jwt.verify(token, secret) as AuthToken;
  } catch {
    return null;
  }
};

export const getTokenFromRequest = (req: NextRequest) => {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  const cookie = req.cookies.get("auth_token");
  return cookie?.value ?? null;
};
