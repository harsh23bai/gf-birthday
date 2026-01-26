import { WebSocketServer } from "ws";
import { MongoClient } from "mongodb";

const port = Number(process.env.WS_PORT ?? 4000);
const wss = new WebSocketServer({ port });
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "gf_birthday";

console.log(`WebSocket server running on ws://localhost:${port}`);

let clientPromise;
if (mongoUri) {
  const client = new MongoClient(mongoUri);
  clientPromise = client.connect();
} else {
  console.warn("MONGODB_URI not set. Chat messages will not persist.");
}

wss.on("connection", (ws) => {
  ws.on("message", async (data) => {
    try {
      const payload = JSON.parse(data.toString());
      if (payload?.type === "message") {
        if (clientPromise) {
          const client = await clientPromise;
          const db = client.db(dbName);
          await db.collection("chat_messages").insertOne(payload);
        }
      }
    } catch {
      // ignore persistence errors
    }

    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  });
});
