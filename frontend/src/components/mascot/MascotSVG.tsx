"use client";

import React from "react";

interface MascotSVGProps {
  size?: number;
  mood?: "happy" | "thinking" | "excited" | "idle";
  className?: string;
}

export function MascotSVG({ size = 80, mood = "idle", className = "" }: MascotSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ─── Antenna ─── */}
      <line x1="50" y1="8" x2="50" y2="22" stroke="#6b21a8" strokeWidth="3.5" strokeLinecap="round" />
      {/* Antenna tip ball */}
      <circle cx="50" cy="5" r="5" fill="#9333ea" />
      {/* Antenna ball shine */}
      <circle cx="48.5" cy="3.5" r="1.5" fill="white" opacity="0.6" />

      {/* ─── Head / Body (single pebble shape) ─── */}
      <rect x="16" y="22" width="68" height="72" rx="28" ry="28" fill="#7c2dbb" />

      {/* Body highlight (top sheen) */}
      <ellipse cx="50" cy="30" rx="24" ry="8" fill="#9333ea" opacity="0.4" />

      {/* ─── Face plate (blank — NO eyes) ─── */}
      <rect x="24" y="30" width="52" height="36" rx="16" fill="#6b21a8" />
      {/* Face plate inner shadow */}
      <rect x="26" y="32" width="48" height="32" rx="14" fill="#581c87" opacity="0.5" />

      {/* ─── Speaker / Mouth grille ─── */}
      {[0, 6, 12].map((offset) => (
        <line
          key={offset}
          x1={37 + offset}
          y1="52"
          x2={37 + offset}
          y2="62"
          stroke="#9333ea"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      {/* Grille dots beside speaker */}
      <circle cx="33" cy="57" r="2" fill="#9333ea" opacity="0.6" />
      <circle cx="63" cy="57" r="2" fill="#9333ea" opacity="0.6" />

      {/* ─── Mood indicator (top of face plate) ─── */}
      {mood === "thinking" && (
        <>
          <circle cx="44" cy="38" r="2" fill="#c4b5fd" />
          <circle cx="50" cy="36" r="2" fill="#c4b5fd" />
          <circle cx="56" cy="38" r="2" fill="#c4b5fd" />
        </>
      )}
      {mood === "excited" && (
        <path d="M38 38 Q50 44 62 38" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
      {mood === "happy" && (
        <path d="M40 40 Q50 46 60 40" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}

      {/* ─── Left arm ─── */}
      <rect x="4" y="50" width="14" height="28" rx="7" fill="#7c2dbb" />
      {/* Left hand */}
      <circle cx="11" cy="81" r="6" fill="#6b21a8" />
      <circle cx="11" cy="81" r="3" fill="#9333ea" opacity="0.5" />

      {/* ─── Right arm ─── */}
      <rect x="82" y="50" width="14" height="28" rx="7" fill="#7c2dbb" />
      {/* Right hand */}
      <circle cx="89" cy="81" r="6" fill="#6b21a8" />
      <circle cx="89" cy="81" r="3" fill="#9333ea" opacity="0.5" />

      {/* ─── Chest panel ─── */}
      <rect x="34" y="74" width="32" height="14" rx="6" fill="#6b21a8" />
      {/* Panel LED dots */}
      <circle cx="42" cy="81" r="2.5" fill="#c4b5fd" />
      <circle cx="50" cy="81" r="2.5" fill={mood === "excited" ? "#fbbf24" : "#5eead4"} />
      <circle cx="58" cy="81" r="2.5" fill="#c4b5fd" />

      {/* ─── Feet ─── */}
      <rect x="28" y="91" width="18" height="12" rx="6" fill="#6b21a8" />
      <rect x="54" y="91" width="18" height="12" rx="6" fill="#6b21a8" />
      {/* Feet shine */}
      <rect x="30" y="93" width="10" height="4" rx="2" fill="#9333ea" opacity="0.4" />
      <rect x="56" y="93" width="10" height="4" rx="2" fill="#9333ea" opacity="0.4" />

      {/* ─── Side panel rivets ─── */}
      <circle cx="22" cy="44" r="2" fill="#6b21a8" />
      <circle cx="78" cy="44" r="2" fill="#6b21a8" />
      <circle cx="22" cy="88" r="2" fill="#6b21a8" />
      <circle cx="78" cy="88" r="2" fill="#6b21a8" />
    </svg>
  );
}
