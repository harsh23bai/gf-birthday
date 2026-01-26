"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "her" | "system";
  name?: string;
  timestamp: string;
  type: "message" | "typing";
};

const makeId = () => Math.random().toString(36).slice(2, 10);

export const useChatSocket = (displayName: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const url = useMemo(
    () =>
      process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000",
    []
  );

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) return;
        const data = (await res.json()) as ChatMessage[];
        setMessages(data.filter((msg) => msg.type === "message"));
      } catch {
        // ignore
      }
    };

    loadHistory();

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "typing") {
          setIsTyping(true);
          if (typingTimer.current) clearTimeout(typingTimer.current);
          typingTimer.current = setTimeout(() => setIsTyping(false), 1200);
          return;
        }
        if (payload.type === "message") {
          setMessages((prev) => [
            ...prev,
            ...(!prev.some((msg) => msg.id === payload.id)
              ? [
                  {
                    id: payload.id ?? makeId(),
                    text: payload.text,
                    sender: payload.sender ?? "her",
                    name: payload.name,
                    timestamp: payload.timestamp ?? new Date().toISOString(),
                    type: "message" as const,
                  },
                ]
              : []),
          ]);
        }
      } catch {
        // Ignore malformed events
      }
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (
    text: string,
    sender: "me" | "her",
    nameOverride?: string
  ) => {
    const payload = {
      id: makeId(),
      type: "message",
      text,
      sender,
      name: nameOverride ?? displayName,
      timestamp: new Date().toISOString(),
    };
    wsRef.current?.send(JSON.stringify(payload));
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => undefined);
    setMessages((prev) => [
      ...prev,
      {
        id: payload.id,
        text,
        sender,
        name: payload.name,
        timestamp: payload.timestamp,
        type: "message",
      },
    ]);
  };

  const sendTyping = () => {
    wsRef.current?.send(JSON.stringify({ type: "typing" }));
  };

  return {
    messages,
    isTyping,
    sendMessage,
    sendTyping,
  };
};
