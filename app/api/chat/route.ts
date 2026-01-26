import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";

type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "her" | "system";
  name?: string;
  timestamp: string;
  type: "message" | "typing";
};

export async function GET() {
  const db = await getDb();
  const messages = await db
    .collection<ChatMessage>("chat_messages")
    .find({ type: "message" })
    .sort({ timestamp: 1 })
    .toArray();
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const payload = (await req.json()) as ChatMessage;
  if (!payload?.text || !payload?.id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const db = await getDb();
  await db.collection<ChatMessage>("chat_messages").insertOne(payload);
  return NextResponse.json({ ok: true });
}
