"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "../../components/AnimatedBackground";
import PasscodeInput from "../../components/PasscodeInput";
import GlowButton from "../../components/GlowButton";

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const passcodeLength = Number(process.env.NEXT_PUBLIC_PASSCODE_LENGTH ?? 6);

  const verify = useCallback(async () => {
    if (!code) return;
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        setError("That passcode is not quite right.");
        return;
      }

      const data = (await res.json()) as { role: "me" | "her" | "guest"; token: string };
      try {
        sessionStorage.setItem("access_role", data.role);
        sessionStorage.setItem("auth_token", data.token);
      } catch {
        // Ignore storage failures
      }
      setError("");
      router.push("/trailer");
    } catch {
      setError("Something went wrong. Try again.");
    }
  }, [code, router]);

  return (
    <div className="relative min-h-screen overflow-hidden romantic-gradient">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass w-full max-w-lg rounded-3xl px-8 py-10"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-rose-200/70">
            Passcode Gate
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-white">
            Enter the secret code
          </h1>
          <p className="mt-3 text-sm text-white/70">
            Only the two of us know the way in.
          </p>

          <motion.div
            animate={error ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            <PasscodeInput
              value={code}
              onChange={setCode}
              length={passcodeLength}
              autoFocus
            />
          </motion.div>

          {error && <p className="mt-4 text-sm text-rose-200">{error}</p>}

          <div className="mt-8">
            <GlowButton label="Unlock" onClick={verify} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
