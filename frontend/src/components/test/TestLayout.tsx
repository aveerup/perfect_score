"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, ChevronLeft, ChevronRight, Maximize2, Minimize2, LogOut, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  sections: string[];
  timeLeft: number;
  onTimeUp?: () => void;
  onExit: () => void;
  onNext: () => void;
  onPrev: () => void;
  nextLabel?: string;
  isLastQuestion?: boolean;
  totalQuestions: number;
  currentQuestion?: number;
  onQuestionSelect?: (index: number) => void;
}

export function TestLayout({
  children,
  activeSection,
  sections,
  timeLeft: initialTime,
  onTimeUp,
  onExit,
  onNext,
  onPrev,
  nextLabel = "Next",
  isLastQuestion = false,
  totalQuestions,
  currentQuestion = 1,
  onQuestionSelect
}: TestLayoutProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const timeUpHandledRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 || timeUpHandledRef.current) return;
    timeUpHandledRef.current = true;
    onTimeUp?.();
  }, [onTimeUp, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col font-sans text-slate-900 select-none overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-white font-black text-xs">PS</span>
            </div>
            <span className="font-bold text-sm tracking-tight">IELTS PRACTICE</span>
          </div>
          
          <nav className="flex gap-6 ml-4">
            {sections.map((s) => (
              <div 
                key={s} 
                className={`text-[11px] font-bold uppercase tracking-widest transition-all ${
                  activeSection === s 
                    ? "text-black border-b-2 border-black pb-1" 
                    : "text-slate-400"
                }`}
              >
                {s}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className={`font-mono font-bold text-sm tabular-nums ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-slate-700"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="h-6 w-px bg-slate-200" />
          
          <button 
            onClick={toggleFullScreen}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            title="Toggle Focus Mode"
          >
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExit}
            className="text-[10px] uppercase font-bold tracking-widest border-slate-300 hover:bg-slate-50"
          >
            <LogOut size={14} className="mr-2" />
            Exit
          </Button>
        </div>
      </header>

      {/* Question Nav Bar (Only for desktop) */}
      <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-6 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <button
              key={i}
              onClick={() => onQuestionSelect?.(i + 1)}
              className={`w-7 h-7 text-[10px] font-bold flex items-center justify-center transition-all rounded-[2px] ${
                currentQuestion === i + 1
                  ? "bg-black text-white shadow-md transform scale-110"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow relative overflow-hidden bg-[#F8FAFC]">
        {children}
      </main>

      {/* Footer Navigation */}
      <footer className="h-16 border-t border-slate-200 bg-white flex items-center justify-between px-8 shrink-0 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
           Question <span className="text-black font-bold text-sm">{currentQuestion}</span> of {totalQuestions}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onPrev}
            className="h-9 px-6 rounded-none border-slate-200 text-xs font-bold uppercase tracking-widest hover:bg-slate-50"
          >
            <ChevronLeft size={16} className="mr-2" />
            Previous
          </Button>
          <Button 
            onClick={onNext}
            className="h-9 px-8 rounded-none bg-black hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
          >
            {nextLabel}
            {isLastQuestion ? <Send size={16} className="ml-2" /> : <ChevronRight size={16} className="ml-2" />}
          </Button>
        </div>
      </footer>
    </div>
  );
}
