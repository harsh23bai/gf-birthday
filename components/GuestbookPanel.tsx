"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt?: string;
};

const seedEntries: Entry[] = [
  { id: "1", name: "Your Love", message: "You light up every room you enter." },
];

export default function GuestbookPanel({
  className = "glass rounded-3xl px-6 py-6",
}: {
  className?: string;
}) {
  const [entries, setEntries] = useState<Entry[]>(seedEntries);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const entry = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
    try {
      await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch {
      // ignore
    }
    setName("");
    setMessage("");
  };

  return (
    <div className={className}>
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-rose-200/70">Guestbook</p>
        <h3 className="text-xl font-semibold text-white">Leave a wish</h3>
      </div>
      <form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="rounded-full bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
        />
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Your message"
          className="md:col-span-2 rounded-full bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          className="rounded-full bg-rose-400/40 px-5 py-3 text-xs uppercase tracking-[0.3em] text-white md:col-span-3"
        >
          Send wish
        </button>
      </form>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 px-4 py-4"
          >
            <p className="text-sm text-white/90">{entry.message}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-rose-200/70">
              {entry.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
