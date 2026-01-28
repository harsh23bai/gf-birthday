"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../../components/AnimatedBackground";
import Loader from "../../components/Loader";
import GlowButton from "../../components/GlowButton";

export default function TrailerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitEnterFullscreen) {
      // iOS Safari
      (video as any).webkitEnterFullscreen();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden romantic-gradient">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div
          className="
            relative w-full max-w-4xl 
            overflow-hidden rounded-3xl 
            border border-white/10 bg-black/30
            aspect-video
          "
        >
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/dn95byqcd/video/upload/v1769524025/demo_vid_sb5btw.mp4"
            poster="https://res.cloudinary.com/dn95byqcd/image/upload/v1769525883/poster_cykqsd.svg"
            className="h-full w-full object-cover"
            autoPlay
            playsInline
            preload="auto"
            controls={true}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            onCanPlay={() => setReady(true)}
            onEnded={() => setEnded(true)}
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Loader */}
          <AnimatePresence>
            {!ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/70"
              >
                <Loader label="Loading Video.." />
              </motion.div>
            )}
          </AnimatePresence>

          {/* MOBILE FULLSCREEN BUTTON */}
          {isMobile && (
            <button
              onClick={handleFullscreen}
              className="
                absolute bottom-3 right-3 
                rounded-full bg-black/70 
                px-4 py-2 text-sm text-white
                backdrop-blur-md
              "
            >
              Fullscreen ⛶
            </button>
          )}
        </div>

        {/* Explore Button */}
        <AnimatePresence>
          {ended && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10"
            >
              <GlowButton
                label="Explore More ✨"
                onClick={() => router.push("/dashboard")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}