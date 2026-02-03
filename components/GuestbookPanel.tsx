"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt?: string;
};

const seedEntries: Entry[] = [];

export default function GuestbookPanel({
  className = "glass rounded-3xl px-5 py-5 md:px-6 md:py-6",
}: {
  className?: string;
}) {
  const [entries, setEntries] = useState<Entry[]>(seedEntries);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Load wishes
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const res = await fetch("/api/guestbook");
        if (!res.ok) return;
        const data = (await res.json()) as Entry[];
        if (data.length > 0) setEntries(data);
      } catch {
        // ignore
      }
    };

    loadEntries();
  }, []);

  // Submit wish
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (res.ok) {
        const saved = (await res.json()) as Entry;
        setEntries((prev) => [saved, ...prev]);
      }
    } catch {
      // ignore
    }

    setName("");
    setMessage("");
  };

  return (
    <div
      className={`
        ${className}
        flex flex-col
        max-h-[78vh] md:max-h-[82vh]
      `}
    >
      {/* Header */}
      <div className="shrink-0">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-200/70">
          Himanshi's Birthday Wishes!!
        </p>
        <h3 className="text-lg md:text-xl font-semibold text-white">
          Leave your wish to a Cat...
        </h3>
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        className="mt-4 md:mt-5 grid gap-2 md:gap-3 md:grid-cols-3 shrink-0"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="rounded-full bg-white/10 px-4 py-2.5 md:py-3 text-sm text-white outline-none placeholder:text-white/40"
        />

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          className="md:col-span-2 rounded-full bg-white/10 px-4 py-2.5 md:py-3 text-sm text-white outline-none placeholder:text-white/40"
        />

        <button
          type="submit"
          className="md:col-span-3 rounded-full bg-rose-400/40 px-5 py-2.5 md:py-3 text-xs uppercase tracking-[0.3em] text-white hover:bg-rose-400/60 transition"
        >
          Send Wish ❤️ Meow..
        </button>
      </form>

      {/* Wishes list */}
      <div
        className="
          mt-4 md:mt-6
          flex-1 overflow-y-auto pr-2
          grid gap-3 md:grid-cols-2

          [&::-webkit-scrollbar]:w-[6px]
          [&::-webkit-scrollbar-thumb]:bg-white/25
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-track]:bg-transparent
        "
      >
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 px-4 py-3"
          >
            <p className="text-sm text-white/90 leading-relaxed">
              {entry.message}
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-rose-200/70">
              {entry.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
