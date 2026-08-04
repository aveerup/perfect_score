"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Panel, 
  Group, 
  Separator 
} from "react-resizable-panels";
import { 
  Eye, 
  Highlighter, 
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReadingPlayerProps {
  passage: string;
  questions: React.ReactNode;
  isPassageBlurred?: boolean;
  onRevealPassage?: () => void;
}

export function ReadingPlayer({
  passage,
  questions,
  isPassageBlurred = false,
  onRevealPassage,
}: ReadingPlayerProps) {
  const [fontSize, setFontSize] = useState(16);
  const [isSkimming, setIsSkimming] = useState(false);
  const [skimmingSpeed, setSkimmingSpeed] = useState(250); // WPM
  const [skimmingIndex, setSkimmingIndex] = useState(-1);
  const passageRef = useRef<HTMLDivElement>(null);
  
  // Split passage into paragraphs for skimming
  const paragraphs = useMemo(
    () => passage.split('\n').filter(p => p.trim() !== ''),
    [passage],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSkimming) {
      // Calculate time per paragraph based on word count
      const startNextParagraph = (index: number) => {
        if (index >= paragraphs.length) {
          setIsSkimming(false);
          setSkimmingIndex(-1);
          return;
        }
        
        setSkimmingIndex(index);
        const wordCount = paragraphs[index].split(/\s+/).length;
        const timeMs = (wordCount / skimmingSpeed) * 60 * 1000;
        
        interval = setTimeout(() => {
          startNextParagraph(index + 1);
        }, timeMs);
      };
      
      startNextParagraph(skimmingIndex === -1 ? 0 : skimmingIndex);
    }
    return () => clearTimeout(interval);
  }, [isSkimming, skimmingIndex, paragraphs, skimmingSpeed]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Tool Ribbon */}
      <div className="h-10 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-7 px-2 text-[10px] font-bold uppercase gap-2 ${isSkimming ? "text-primary bg-primary/10" : "text-slate-500"}`}
              onClick={() => setIsSkimming(!isSkimming)}
            >
              {isSkimming ? <Pause size={14} /> : <Play size={14} />}
              {isSkimming ? "Stop Skimming" : "Start Skimming"}
            </Button>
            
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Speed:</span>
              <select 
                className="text-[10px] font-bold outline-none cursor-pointer bg-slate-100 rounded px-1"
                value={skimmingSpeed}
                onChange={(e) => setSkimmingSpeed(Number(e.target.value))}
              >
                <option value={150}>150 WPM</option>
                <option value={200}>200 WPM</option>
                <option value={250}>250 WPM</option>
                <option value={300}>300 WPM</option>
                <option value={400}>400 WPM</option>
              </select>
            </div>
            
            {skimmingIndex !== -1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-slate-400"
                onClick={() => { setIsSkimming(false); setSkimmingIndex(-1); }}
              >
                <RotateCcw size={14} />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-500"><Highlighter size={14} /></Button>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <button onClick={() => setFontSize(Math.max(12, fontSize - 1))} className="p-1 text-slate-500 hover:bg-slate-100 rounded">A-</button>
            <span className="text-[10px] font-mono font-bold text-slate-400">{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="p-1 text-slate-500 hover:bg-slate-100 rounded">A+</button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-slate-400">
           <Eye size={14} />
           <span className="text-[10px] font-bold uppercase tracking-widest italic">Reader Mode</span>
        </div>
      </div>

      {/* Main Resizable Layout */}
      <Group orientation="horizontal" className="flex-grow">
        <Panel defaultSize={50} minSize={30} className="bg-white">
          <div 
            ref={passageRef}
            className={`relative h-full overflow-y-auto p-12 leading-relaxed text-slate-800 transition-all selection:bg-yellow-200 ${
              isPassageBlurred ? "cursor-pointer" : ""
            }`}
            style={{ fontSize: `${fontSize}px` }}
            onClick={() => {
              if (isPassageBlurred) onRevealPassage?.();
            }}
            onKeyDown={(event) => {
              if (!isPassageBlurred || (event.key !== "Enter" && event.key !== " ")) return;
              event.preventDefault();
              onRevealPassage?.();
            }}
            role={isPassageBlurred ? "button" : undefined}
            tabIndex={isPassageBlurred ? 0 : undefined}
            aria-label={isPassageBlurred ? "Reveal reading passage" : undefined}
          >
            <div
              className={`max-w-2xl mx-auto space-y-6 transition-all duration-300 ${
                isPassageBlurred ? "blur-sm opacity-40 select-none" : ""
              }`}
            >
              {paragraphs.map((p, i) => (
                <p 
                  key={i} 
                  className={`transition-all duration-300 rounded ${
                    skimmingIndex === i 
                      ? "bg-slate-900 text-white p-4 shadow-xl -mx-4 scale-[1.02]" 
                      : skimmingIndex !== -1 ? "opacity-30 grayscale" : ""
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
            {isPassageBlurred && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                <div className="h-16 w-16 rounded-full bg-white/90 border border-slate-200 shadow-xl flex items-center justify-center text-slate-700">
                  <Eye size={24} />
                </div>
              </div>
            )}
          </div>
        </Panel>

        <Separator className="w-1.5 bg-slate-100 hover:bg-slate-300 transition-colors border-x border-slate-200 flex items-center justify-center group">
          <div className="w-0.5 h-8 bg-slate-300 group-hover:bg-slate-500 rounded-full" />
        </Separator>

        <Panel defaultSize={50} minSize={30} className="bg-white border-l border-slate-200">
          <div className="h-full overflow-y-auto p-12 bg-slate-50/50">
            <div className="max-w-xl mx-auto">
              {questions}
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
}
