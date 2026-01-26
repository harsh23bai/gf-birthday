"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useChatSocket } from "../hooks/useChatSocket";
import TypingIndicator from "./TypingIndicator";

export default function ChatPanel({
  className = "glass flex h-[520px] flex-col rounded-3xl px-6 py-6",
}: {
  className?: string;
}) {
  const [input, setInput] = useState("");
  const [sender, setSender] = useState<"me" | "her">("me");
  const [localRole, setLocalRole] = useState<"me" | "her">("me");
  const [token, setToken] = useState<string | null>(null);
  const roomId = useMemo(
    () => process.env.NEXT_PUBLIC_CHAT_ROOM ?? "love-room",
    []
  );
  const { messages, isTyping, connectionStatus, sendMessage, sendTyping } =
    useChatSocket({
      displayName: sender === "me" ? "You" : "Her",
      role: sender,
      token,
      roomId,
    });

  useEffect(() => {
    try {
      const role = sessionStorage.getItem("access_role");
      const storedToken = sessionStorage.getItem("auth_token");
      if (storedToken) setToken(storedToken);
      if (role === "her") {
        setSender("her");
        setLocalRole("her");
      }
      if (role === "me") {
        setSender("me");
        setLocalRole("me");
      }
    } catch {
      // ignore
    }
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-rose-200/70">
            Sweet Chat
          </p>
          <h3 className="text-xl font-semibold text-white">Say something dreamy</h3>
        </div>
        <span className="text-xs text-white/60">
          {connectionStatus === "connected" ? "Connected" : "Connecting..."}
        </span>
      </div>

      <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/60">
        Sending as You
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-2 hide-scrollbar">
        {messages.length === 0 && (
          <p className="text-sm text-white/60">
            The conversation starts here. Say hello, say anything you feel.
          </p>
        )}
        {messages.map((message) => {
          const isLocal =
            localRole === "her"
              ? message.sender === "her"
              : message.sender === "me";
          return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              isLocal ? "ml-auto bg-rose-400/30" : "bg-white/10"
            }`}
          >
            <p className="text-white/90">{message.text}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
              {isLocal ? "You" : localRole === "her" ? "He" : "Her"}
            </p>
            {isLocal && message.status === "sending" && (
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
                Sending...
              </p>
            )}
            {isLocal && message.status === "failed" && (
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-rose-200">
                Failed — retry
              </p>
            )}
          </motion.div>
        );
        })}
        {isTyping && (
          <TypingIndicator
            label={localRole === "her" ? "He is typing" : "Her is typing"}
          />
        )}
      </div>

      <form onSubmit={submit} className="mt-5 flex gap-3">
        <input
          value={input}
          onChange={(event) => {
            const value = event.target.value;
            setInput(value);
            if (value.trim().length > 0) {
              sendTyping();
            }
          }}
          placeholder="Type something warm..."
          className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="rounded-full bg-rose-400/40 px-5 py-3 text-xs uppercase tracking-[0.3em] text-white"
        >
          Send
        </motion.button>
      </form>
    </div>
  );
}
