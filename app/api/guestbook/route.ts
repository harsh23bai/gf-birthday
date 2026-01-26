import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export async function GET() {
  const db = await getDb();
  const entries = await db
    .collection<GuestbookEntry>("guestbook_entries")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const payload = (await req.json()) as GuestbookEntry;
  if (!payload?.name || !payload?.message || !payload?.id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const db = await getDb();
  await db.collection<GuestbookEntry>("guestbook_entries").insertOne(payload);
  return NextResponse.json({ ok: true });
}
