"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MascotSVG } from "./MascotSVG";
import { X, Lightbulb, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

const tips: Record<string, string[]> = {
  default: [
    "Did you know? Regular listening to podcasts can improve your IELTS score!",
    "Remember to manage your time during the reading section.",
    "Practice speaking in front of a mirror to build confidence.",
    "Focus on synonyms; they are key to a high band in Writing.",
  ],
  "/": [
    "Welcome to Perfect Score! Ready to achieve your dream band?",
    "Check out our Free Resources section for study guides.",
    "Our AI writing feedback is available 24/7!",
  ],
  "/dashboard": [
    "Focus on your weakest skill today to see the fastest progress.",
    "Have you completed your daily vocabulary drills yet?",
    "Your predicted score is based on your latest mock tests.",
  ],
  "/features": [
    "Explore all 8 modules to find what works best for you.",
    "The Speaking Coach uses real IELTS questions!",
  ],
  "/about": [
    "Our mission is to help 1 million students achieve Band 8+.",
    "The team is always working on new features for you!",
  ],
};

export function MascotWidget() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState("");
  const [mood, setMood] = useState<"happy" | "thinking" | "excited" | "idle">("idle");

  useEffect(() => {
    // Show after 2 seconds
    const timer = setTimeout(() => {
      const pageTips = tips[pathname] || tips.default;
      setCurrentTip(pageTips[Math.floor(Math.random() * pageTips.length)]);
      setIsVisible(true);
      setMood("happy");
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleNextTip = () => {
    const pageTips = tips[pathname] || tips.default;
    let nextTip = pageTips[Math.floor(Math.random() * pageTips.length)];
    // Ensure it's a different tip if possible
    if (pageTips.length > 1 && nextTip === currentTip) {
      nextTip = pageTips.find((t) => t !== currentTip) || nextTip;
    }
    setCurrentTip(nextTip);
    setMood("thinking");
    setTimeout(() => setMood("idle"), 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="pointer-events-auto flex flex-col items-end max-w-[280px]"
          >
            {/* Speech Bubble */}
            <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 relative mb-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="bg-accent/10 p-1.5 rounded-lg">
                  <Lightbulb className="w-3.5 h-3.5 text-accent" />
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                "{currentTip}"
              </p>
              <button 
                onClick={handleNextTip}
                className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest hover:gap-2 transition-all"
              >
                Next Tip <ArrowRight className="w-3 h-3" />
              </button>
              
              {/* Bubble tail */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45" />
            </div>

            {/* Mascot Character */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="cursor-pointer group"
              onClick={() => {
                setMood("excited");
                setTimeout(() => setMood("idle"), 1000);
              }}
            >
              <MascotSVG size={90} mood={mood} className="drop-shadow-xl" />
              
              {/* Ring effect when idle/hidden */}
              <div className="absolute -inset-4 bg-accent/5 rounded-full blur-xl scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsVisible(true)}
          className="pointer-events-auto w-12 h-12 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-accent hover:bg-slate-50 transition-all hover:scale-110 active:scale-95 group"
        >
          <div className="relative">
            <MascotSVG size={32} className="opacity-80 group-hover:opacity-100" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white animate-pulse" />
          </div>
        </motion.button>
      )}
    </div>
  );
}
