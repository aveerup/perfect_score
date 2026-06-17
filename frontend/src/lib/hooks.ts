"use client";

import { useState, useEffect } from "react";

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem("ps_premium") === "true";
    setIsPremium(saved);

    // Listen for custom event
    const handleToggle = () => {
      setIsPremium(localStorage.getItem("ps_premium") === "true");
    };

    window.addEventListener("premium_toggle", handleToggle);
    return () => window.removeEventListener("premium_toggle", handleToggle);
  }, []);

  const togglePremium = () => {
    const newState = !isPremium;
    localStorage.setItem("ps_premium", String(newState));
    setIsPremium(newState);
    // Dispatch custom event to notify other instances of the hook
    window.dispatchEvent(new Event("premium_toggle"));
  };

  return { isPremium, togglePremium };
}
