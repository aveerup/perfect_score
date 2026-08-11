"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Trophy, Target, Zap, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TypingTestProps {
  text: string;
  onFinish?: (results: { wpm: number; accuracy: number; durationSeconds: number }) => void;
}

export function TypingTest({ text, onFinish }: TypingTestProps) {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const charArray = useMemo(() => text.split(""), [text]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (val.length <= charArray.length) {
      setUserInput(val);
      
      if (val.length === charArray.length) {
        const finishedAt = Date.now();
        const elapsedMinutes = Math.max((finishedAt - (startTime || finishedAt)) / 60000, 1 / 60);
        const correct = val.split("").filter((char, index) => char === (charArray[index] === "\n" ? " " : charArray[index])).length;
        const finalWpm = Math.round((val.length / 5) / elapsedMinutes);
        const finalAccuracy = Math.round((correct / val.length) * 100);
        setWpm(finalWpm);
        setAccuracy(finalAccuracy);
        setEndTime(finishedAt);
        setIsFinished(true);
        onFinish?.({
          wpm: finalWpm,
          accuracy: finalAccuracy,
          durationSeconds: Math.round((finishedAt - (startTime || finishedAt)) / 1000),
        });
      }
    }
  };

  useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        setElapsedSeconds(Math.round((now - startTime) / 1000));
        const diff = (now - startTime) / 1000 / 60; // minutes
        const typedChars = userInput.length;
        const currentWpm = Math.round((typedChars / 5) / diff);
        setWpm(currentWpm);

        // Accuracy
        let correct = 0;
        for (let i = 0; i < userInput.length; i++) {
          if (userInput[i] === charArray[i]) correct++;
        }
        setAccuracy(Math.round((correct / userInput.length) * 100) || 100);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime, userInput, charArray]);

  const reset = () => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setElapsedSeconds(0);
    if (inputRef.current) inputRef.current.focus();
  };

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-12" onClick={focusInput}>
      {/* STATS BAR */}
      <div className="flex gap-12 items-center justify-center opacity-80 mt-[-20px] mb-8">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Speed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono">{wpm}</span>
            <span className="text-xs text-secondary opacity-60">WPM</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Accuracy</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono">{accuracy}</span>
            <span className="text-xs text-secondary opacity-60">%</span>
          </div>
        </div>
        {startTime && !endTime && (
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Time</span>
             <span className="text-2xl font-mono font-bold tracking-tighter italic">
                {elapsedSeconds}s
             </span>
          </div>
        )}
      </div>

      {/* TYPING AREA */}
      <div className="relative leading-relaxed text-2xl md:text-3xl font-light select-none group cursor-text transition-opacity duration-300" 
           style={{ opacity: isFinished ? 0.3 : 1 }}>
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          value={userInput}
          onChange={handleInputChange}
          autoFocus
        />
        
        <div className="font-serif whitespace-pre-wrap break-words">
          {charArray.map((char, i) => {
            let colorClass = "text-secondary opacity-60";
            const showCursorBefore = !isFinished && userInput.length === 0 && i === 0;
            const showCursorAfter = !isFinished && userInput.length === i + 1;
            
            if (i < userInput.length) {
              const userChar = userInput[i];
              // Handle newline as a space in matching logic if user didn't type it
              const targetChar = char === "\n" ? " " : char;
              colorClass = userChar === targetChar ? "text-on-surface" : "text-error border-b-2 border-error border-opacity-30";
            }

            return (
              <span key={i} className={`relative ${colorClass} transition-colors duration-200`}>
                {showCursorBefore && <TypingCursor position="before" />}
                {char}
                {showCursorAfter && <TypingCursor position="after" />}
              </span>
            );
          })}
        </div>
      </div>

      {/* RESTART */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={(e) => { e.stopPropagation(); reset(); }}
          className="p-3 text-secondary hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-low"
          title="Restart Test"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {/* RESULTS OVERLAY */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="fixed inset-0 z-50 bg-surface flex items-center justify-center p-6"
          >
            <div className="max-w-2xl w-full space-y-12">
               <div className="space-y-4 text-center">
                  <div className="inline-block p-4 bg-primary text-on-primary rounded-full mb-4">
                     <Keyboard className="w-10 h-10" />
                  </div>
                  <h2 className="text-5xl font-bold uppercase tracking-tighter italic">Test Complete</h2>
                  <p className="text-secondary font-light">Great performance. Your typing speed is well within the IELTS Band 9 bracket.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ResultCard icon={<Zap className="w-5 h-5" />} label="Speed" value={`${wpm}`} unit="WPM" />
                  <ResultCard icon={<Target className="w-5 h-5" />} label="Accuracy" value={`${accuracy}`} unit="%" />
                  <ResultCard icon={<Trophy className="w-5 h-5" />} label="Time" value={`${Math.round(((endTime || 0) - (startTime || 0)) / 1000)}`} unit="sec" />
               </div>

               <div className="flex flex-col items-center gap-4 pt-8">
                  <Button onClick={reset} size="lg" className="h-16 px-12 bg-primary text-on-primary uppercase tracking-widest font-bold rounded-sm w-full md:w-auto">
                    Try Again
                  </Button>
                  <Button variant="ghost" onClick={() => window.location.reload()} className="text-xs uppercase tracking-widest text-secondary hover:text-on-surface">
                    Exit Module
                  </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingCursor({ position }: { position: "before" | "after" }) {
  return (
    <span
      aria-hidden="true"
      className={`typing-cursor pointer-events-none absolute top-[8%] h-[84%] w-[2px] bg-primary ${
        position === "before" ? "-left-[1px]" : "-right-[1px]"
      }`}
    />
  );
}

function ResultCard({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string, unit: string }) {
  return (
    <div className="p-8 border border-border bg-surface-container-low space-y-4 flex flex-col items-center">
       <div className="text-primary">{icon}</div>
       <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{label}</p>
          <div className="flex items-baseline justify-center gap-1">
             <span className="text-4xl font-bold font-mono italic">{value}</span>
             <span className="text-xs text-secondary">{unit}</span>
          </div>
       </div>
    </div>
  );
}
