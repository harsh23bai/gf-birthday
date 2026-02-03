"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import AnimatedBackground from "../../components/AnimatedBackground";
import GlassCard from "../../components/GlassCard";
import ChatPanel from "../../components/ChatPanel";
import GuestbookPanel from "../../components/GuestbookPanel";
import PoemPanel from "../../components/PoemPanel";
import SurprisePanel from "../../components/SurprisePanel";
import Modal from "../../components/Modal";
import GlowButton from "../../components/GlowButton";

type PanelKey = "chat" | "guestbook" | "poem" | "surprise";

export default function DashboardPage() {
  const router = useRouter();

  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [accessRole, setAccessRole] = useState<
    "me" | "her" | "guest" | null
  >(null);

  useEffect(() => {
    try {
      const role = sessionStorage.getItem("access_role");
      if (!role) {
        router.push("/login");
        return;
      }

      setAccessRole(
        role === "guest" ? "guest" : role === "her" ? "her" : "me"
      );
    } catch {
      router.push("/login");
    }
  }, [router]);

  const canAccess = useMemo(() => {
    if (accessRole === null) return [] as PanelKey[];
    if (accessRole === "guest") return ["guestbook"] as PanelKey[];
    return ["chat", "guestbook", "poem", "surprise"] as PanelKey[];
  }, [accessRole]);

  const openPanel = (panel: PanelKey) => {
    if (!canAccess.includes(panel)) return;
    setActivePanel(panel);
  };

  return (
    <div className="relative min-h-screen overflow-hidden romantic-gradient">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h3 className="text-xs uppercase tracking-[0.35em] text-rose-200/70">
            Billu's Hub
          </h3>

          <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            Everything I wanted you to feel is Happy
          </h1>

          <p className="mt-3 text-sm text-white/70 md:text-base">
           You used to be my everything
          </p>
          <p className="mt-3 text-sm text-white/70 md:text-base">
            Four little worlds, each glowing with something for you.
          </p>
        </motion.div>

        {/* PANELS GRID */}
        <div
          className={`grid gap-4 ${
            accessRole === "guest"
              ? "md:grid-cols-1"
              : "md:grid-cols-2"
          }`}
        >
          {canAccess.includes("chat") && (
            <GlassCard
              title="Chatify with Billo and Billu"
              description=""
              icon="💬"
              active={activePanel === "chat"}
              onClick={() => openPanel("chat")}
            />
          )}

          {canAccess.includes("guestbook") && (
            <GlassCard
              title="Billo's Wishbook"
              description=""
              icon="📖"
              active={activePanel === "guestbook"}
              onClick={() => openPanel("guestbook")}
            />
          )}

          {canAccess.includes("poem") && (
            <GlassCard
              title="Poem-e-dil"
              description=""
              icon="✍️"
              active={activePanel === "poem"}
              onClick={() => openPanel("poem")}
            />
          )}

          {canAccess.includes("surprise") && (
            <GlassCard
              title="Surprise Gift"
              description=""
              icon="🎁"
              active={activePanel === "surprise"}
              onClick={() => openPanel("surprise")}
            />
          )}
        </div>

        {/* BACK TO TRAILER BUTTON — CENTERED */}
        <div className="mt-14 flex justify-center sticky bottom-6">
          <GlowButton
            label="Back to Birthday Video 🎬"
            onClick={() => router.push("/trailer")}
          />
        </div>

        {/* MODALS */}
        <Modal
          open={activePanel === "chat"}
          onClose={() => setActivePanel(null)}
          title="Chat"
        >
          <ChatPanel className="flex h-[520px] flex-col" />
        </Modal>

        <Modal
          open={activePanel === "guestbook"}
          onClose={() => setActivePanel(null)}
          title="Guestbook"
        >
          <GuestbookPanel className="bg-transparent px-0 py-0" />
        </Modal>

        <Modal
          open={activePanel === "poem"}
          onClose={() => setActivePanel(null)}
          title="Birthday Poem"
        >
          <PoemPanel className="bg-transparent px-0 py-0" />
        </Modal>

        <Modal
          open={activePanel === "surprise"}
          onClose={() => setActivePanel(null)}
          title="Surprise Gift"
        >
          <SurprisePanel className="bg-transparent px-0 py-0" />
        </Modal>
      </div>
    </div>
  );
}