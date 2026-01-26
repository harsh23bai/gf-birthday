"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "her" | "system";
  name?: string;
  timestamp: string;
  type: "message" | "typing";
  roomId: string;
  clientId?: string;
  status?: "sending" | "sent" | "failed";
};

const makeId = () => Math.random().toString(36).slice(2, 10);

type ChatEvent =
  | { type: "typing"; sender: "me" | "her"; roomId: string }
  | (ChatMessage & { type: "message" });

export const useChatSocket = ({
  displayName,
  role,
  token,
  roomId,
}: {
  displayName: string;
  role: "me" | "her";
  token: string | null;
  roomId: string;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const url = useMemo(
    () => process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000",
    []
  );

  useEffect(() => {
    if (!token) return;
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/chat", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) return;
        const data = (await res.json()) as ChatMessage[];
        setMessages(data.filter((msg) => msg.type === "message"));
      } catch {
        // ignore
      }
    };

    loadHistory();

    const ws = new WebSocket(`${url}?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;
    setConnectionStatus("connecting");

    ws.onopen = () => setConnectionStatus("connected");
    ws.onerror = () => setConnectionStatus("error");
    ws.onclose = () => setConnectionStatus("error");

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as ChatEvent;
        if (payload.type === "typing") {
          if (payload.roomId !== roomId || payload.sender === role) return;
          setIsTyping(true);
          if (typingTimer.current) clearTimeout(typingTimer.current);
          typingTimer.current = setTimeout(() => setIsTyping(false), 1200);
          return;
        }
        if (payload.type === "message" && payload.roomId === roomId) {
          setMessages((prev) => {
            if (payload.clientId) {
              const hasClient = prev.some(
                (msg) => msg.clientId === payload.clientId
              );
              if (hasClient) {
                return prev.map((msg) =>
                  msg.clientId === payload.clientId
                    ? { ...msg, id: payload.id, status: "sent" }
                    : msg
                );
              }
            }

            if (prev.some((msg) => msg.id === payload.id)) return prev;

            return [
              ...prev,
              {
                id: payload.id,
                text: payload.text,
                sender: payload.sender,
                name: payload.name,
                timestamp: payload.timestamp,
                type: "message" as const,
                roomId: payload.roomId,
                clientId: payload.clientId,
                status: "sent",
              },
            ];
          });
        }
      } catch {
        // Ignore malformed events
      }
    };

    return () => {
      ws.close();
    };
  }, [url, token, roomId, role]);

  const sendMessage = async (text: string) => {
    const clientId = makeId();
    const optimistic: ChatMessage = {
      id: clientId,
      clientId,
      type: "message",
      text,
      sender: role,
      name: displayName,
      timestamp: new Date().toISOString(),
      roomId,
      status: "sending",
    };

    setMessages((prev) => [
      ...prev,
      optimistic,
    ]);

    const wsPayload = {
      type: "message",
      text,
      roomId,
      clientId,
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(wsPayload));
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ text, clientId }),
      });
      if (res.ok) {
        const saved = (await res.json()) as ChatMessage;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.clientId === clientId ? { ...saved, status: "sent" } : msg
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.clientId === clientId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  const sendTyping = () => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(
      JSON.stringify({ type: "typing", roomId, sender: role })
    );
  };

  return {
    messages,
    isTyping,
    connectionStatus,
    sendMessage,
    sendTyping,
  };
};
