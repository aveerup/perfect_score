"use client";

import { cn } from "@/lib/utils";

type Finger = "left-pinky" | "left-ring" | "left-middle" | "left-index" | "right-index" | "right-middle" | "right-ring" | "right-pinky";

const ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

const FINGER_KEYS: Record<Finger, string> = {
  "left-pinky": "1qaz",
  "left-ring": "2wsx",
  "left-middle": "3edc",
  "left-index": "45rtfgvb",
  "right-index": "67yuhjnm",
  "right-middle": "8ik,",
  "right-ring": "9ol.",
  "right-pinky": "0p;/-=[]'",
};

const FINGER_LABELS: Record<Finger, string> = {
  "left-pinky": "Left pinky",
  "left-ring": "Left ring",
  "left-middle": "Left middle",
  "left-index": "Left index",
  "right-index": "Right index",
  "right-middle": "Right middle",
  "right-ring": "Right ring",
  "right-pinky": "Right pinky",
};

const FINGER_STYLES: Record<Finger, string> = {
  "left-pinky": "bg-rose-100 text-rose-800 border-rose-200",
  "left-ring": "bg-orange-100 text-orange-800 border-orange-200",
  "left-middle": "bg-amber-100 text-amber-800 border-amber-200",
  "left-index": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "right-index": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "right-middle": "bg-blue-100 text-blue-800 border-blue-200",
  "right-ring": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "right-pinky": "bg-violet-100 text-violet-800 border-violet-200",
};

const SHIFTED_KEYS: Record<string, string> = {
  "!": "1",
  "@": "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  "_": "-",
  "+": "=",
  "{": "[",
  "}": "]",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
};

function baseKey(value: string) {
  if (value === " ") return "space";
  return SHIFTED_KEYS[value] ?? value.toLowerCase();
}

function fingerForKey(key: string): Finger | "thumb" {
  if (key === "space") return "thumb";
  return (Object.keys(FINGER_KEYS) as Finger[]).find((finger) => FINGER_KEYS[finger].includes(key)) ?? "right-pinky";
}

export function KeyboardGuide({ nextKey, lessonKeys }: { nextKey: string; lessonKeys: string[] }) {
  const nextBaseKey = baseKey(nextKey);
  const nextFinger = fingerForKey(nextBaseKey);
  const needsShift = nextKey !== nextKey.toLowerCase() || Boolean(SHIFTED_KEYS[nextKey]);
  const activeKeys = new Set(lessonKeys.map(baseKey));
  const nextKeyLabel = nextKey === " " ? "Space" : nextKey;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="US QWERTY finger guide">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Next key</p>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-mono text-2xl font-black text-slate-950">{nextKeyLabel}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {nextFinger === "thumb" ? "Thumb" : FINGER_LABELS[nextFinger]}
            </span>
            {needsShift && <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">+ opposite Shift</span>}
          </div>
        </div>
        <p className="max-w-xs text-right text-xs font-medium leading-5 text-slate-400">Colored keys show the finger responsible for each reach.</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="mx-auto min-w-[650px] max-w-3xl space-y-2">
          {ROWS.map((row, rowIndex) => (
            <div
              key={row.join("")}
              className={cn("flex gap-2", rowIndex === 1 && "pl-5", rowIndex === 2 && "pl-9", rowIndex === 3 && "pl-16")}
            >
              {row.map((key) => {
                const finger = fingerForKey(key) as Finger;
                const isNext = nextBaseKey === key;
                const isInLesson = activeKeys.has(key) || isNext;
                return (
                  <div
                    key={key}
                    className={cn(
                      "relative flex h-11 flex-1 items-center justify-center rounded-xl border font-mono text-sm font-black uppercase transition-all",
                      isInLesson ? FINGER_STYLES[finger] : "border-slate-100 bg-slate-50 text-slate-300",
                      isNext && "z-10 scale-110 border-slate-950 ring-4 ring-slate-950/10",
                    )}
                  >
                    {key}
                    {(key === "f" || key === "j") && <span className="absolute bottom-1 h-0.5 w-3 rounded-full bg-current opacity-50" />}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="flex justify-center pt-1">
            <div className={cn(
              "flex h-10 w-64 items-center justify-center rounded-xl border text-[10px] font-black uppercase tracking-[0.2em]",
              nextBaseKey === "space" ? "scale-105 border-slate-950 bg-slate-950 text-white ring-4 ring-slate-950/10" : "border-slate-200 bg-slate-50 text-slate-400",
            )}>Space · thumb</div>
          </div>
        </div>
      </div>
    </section>
  );
}
