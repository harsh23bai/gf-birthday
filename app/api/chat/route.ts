import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { getTokenFromRequest, verifyToken } from "../../../lib/auth";

export const runtime = "nodejs";

type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "her" | "system";
  name?: string;
  timestamp: string;
  type: "message" | "typing";
  roomId: string;
  clientId?: string;
};

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role === "guest") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await getDb();
  const messages = await db
    .collection<ChatMessage>("chat_messages")
    .find({ type: "message", roomId: payload.roomId })
    .sort({ timestamp: 1 })
    .toArray();
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role === "guest") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { text?: string; clientId?: string };
  if (!body?.text) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const message: ChatMessage = {
    id: randomUUID(),
    text: body.text,
    sender: payload.role === "her" ? "her" : "me",
    name: payload.role === "her" ? "Her" : "You",
    timestamp: new Date().toISOString(),
    type: "message",
    roomId: payload.roomId,
    clientId: body.clientId,
  };

  const db = await getDb();
  await db.collection<ChatMessage>("chat_messages").insertOne(message);
  return NextResponse.json(message);
}
