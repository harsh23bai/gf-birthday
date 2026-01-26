import "dotenv/config";
import { WebSocketServer } from "ws";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const port = Number(process.env.WS_PORT ?? 4000);
const wss = new WebSocketServer({ port });
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "gf_birthday";
const jwtSecret = process.env.JWT_SECRET;
const roomId = process.env.CHAT_ROOM ?? "love-room";

console.log(`WebSocket server running on ws://localhost:${port}`);

let clientPromise;
if (mongoUri) {
  const client = new MongoClient(mongoUri);
  clientPromise = client.connect();
} else {
  console.warn("MONGODB_URI not set. Chat messages will not persist.");
}

wss.on("connection", (ws, request) => {
  if (!jwtSecret) {
    ws.close();
    return;
  }

  const url = new URL(request.url ?? "", `http://${request.headers.host}`);
  const token = url.searchParams.get("token");
  if (!token) {
    ws.close();
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    ws.close();
    return;
  }

  if (!payload || payload.role === "guest") {
    ws.close();
    return;
  }

  ws.meta = {
    role: payload.role,
    roomId: payload.roomId ?? roomId,
  };

  ws.on("message", async (data) => {
    try {
      const incoming = JSON.parse(data.toString());
      if (!ws.meta) return;

      if (incoming?.type === "typing") {
        const typingEvent = {
          type: "typing",
          sender: ws.meta.role,
          roomId: ws.meta.roomId,
        };
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.meta?.roomId === ws.meta.roomId) {
            client.send(JSON.stringify(typingEvent));
          }
        }
        return;
      }

      if (incoming?.type === "message" && incoming?.text) {
        const message = {
          id: randomUUID(),
          text: incoming.text,
          sender: ws.meta.role,
          name: ws.meta.role === "her" ? "Her" : "You",
          timestamp: new Date().toISOString(),
          type: "message",
          roomId: ws.meta.roomId,
          clientId: incoming.clientId,
        };

        if (clientPromise) {
          const client = await clientPromise;
          const db = client.db(dbName);
          await db.collection("chat_messages").insertOne(message);
        }

        for (const client of wss.clients) {
          if (client.readyState === 1 && client.meta?.roomId === ws.meta.roomId) {
            client.send(JSON.stringify(message));
          }
        }
      }
    } catch {
      // ignore persistence errors
    }
  });
});
