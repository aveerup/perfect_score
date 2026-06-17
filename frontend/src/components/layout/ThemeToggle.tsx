"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-surface-container border border-border text-on-surface shadow-sm hover:shadow-md transition-all flex items-center justify-center group"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        <motion.div
          animate={isDark ? { rotate: 90, opacity: 0, scale: 0 } : { rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center text-amber-500"
        >
          <Sun size={20} strokeWidth={2.5} />
        </motion.div>
        <motion.div
          animate={isDark ? { rotate: 0, opacity: 1, scale: 1 } : { rotate: -90, opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center text-grape-600 dark:text-purple-400"
        >
          <Moon size={20} strokeWidth={2.5} />
        </motion.div>
      </div>
    </motion.button>
  );
}
