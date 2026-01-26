import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "../../../lib/mongodb";
import { getTokenFromRequest, verifyToken } from "../../../lib/auth";

export const runtime = "nodejs";

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  roomId: string;
};

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await getDb();
  const entries = await db
    .collection<GuestbookEntry>("guestbook_entries")
    .find({ roomId: payload.roomId })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { name?: string; message?: string };
  if (!body?.name || !body?.message) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const entry: GuestbookEntry = {
    id: randomUUID(),
    name: body.name,
    message: body.message,
    createdAt: new Date().toISOString(),
    roomId: payload.roomId,
  };

  const db = await getDb();
  await db.collection<GuestbookEntry>("guestbook_entries").insertOne(entry);
  return NextResponse.json(entry);
}
