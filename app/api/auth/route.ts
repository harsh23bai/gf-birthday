import { NextResponse } from "next/server";
import { signToken } from "../../../lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as { code?: string };
  const code = body?.code?.trim();

  const meCode = process.env.PASSCODE_ME ?? "";
  const herCode = process.env.PASSCODE_HER ?? "";
  const guestCode = process.env.PASSCODE_GUEST ?? "";
  const roomId = process.env.CHAT_ROOM ?? "love-room";

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  let role: "me" | "her" | "guest" | null = null;

  if (code === meCode) role = "me";       // ✅ Harsh
  if (code === herCode) role = "her";     // ✅ Himanshi
  if (code === guestCode) role = "guest";

  if (!role) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  const token = signToken({ role, roomId });

  const response = NextResponse.json({
    role,
    token,
  });

  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
