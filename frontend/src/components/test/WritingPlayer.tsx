"use client";

import React, { useState, useRef } from "react";
import { 
  Trash2, 
  Maximize2, 
  Scan,
  Loader2,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createWorker } from "tesseract.js";
import { Panel, Group, Separator } from "react-resizable-panels";

interface WritingPlayerProps {
  prompt: string;
  targetWords: number;
  diagramUrl?: string;
  onChange?: (text: string) => void;
}

export function WritingPlayer({ prompt, targetWords, diagramUrl, onChange }: WritingPlayerProps) {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleOCR = async (file: File) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker('eng');
      const { data: { text: recognizedText } } = await worker.recognize(file);
      setText(prev => {
        const next = prev + (prev ? "\n\n" : "") + recognizedText;
        onChange?.(next);
        return next;
      });
      await worker.terminate();
    } catch (err) {
      console.error("OCR Error:", err);
      alert("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const progressPercentage = Math.min(100, (wordCount / targetWords) * 100);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => e.target.files?.[0] && handleOCR(e.target.files[0])}
      />
      
      <Group orientation="horizontal" className="flex-grow">
        {/* Left: Prompt */}
        <Panel defaultSize={40} minSize={30} className="bg-slate-50 border-r border-slate-200">
          <div className="h-full overflow-y-auto p-12 space-y-8">
            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">The Context</span>
               <h3 className="text-xl font-bold tracking-tight text-slate-800 leading-snug">
                 {prompt}
               </h3>
            </div>

            {diagramUrl && (
              <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-200 group relative">
                 {/* Diagram URLs may come from user-managed Supabase Storage buckets. */}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={diagramUrl} alt="Writing Task Diagram" className="w-full h-auto rounded-2xl" />
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="rounded-full shadow-lg">
                       <Maximize2 size={14} className="mr-2" />
                       View Full Diagram
                    </Button>
                 </div>
              </div>
            )}
            
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3 shadow-xl">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Requirement</p>
               <p className="text-sm font-medium leading-relaxed">
                 You should write at least <span className="text-primary-foreground font-black underline decoration-primary decoration-4">{targetWords} words</span> for this task.
               </p>
            </div>
          </div>
        </Panel>

        <Separator className="w-1 bg-slate-100 hover:bg-slate-300 transition-colors" />

        {/* Right: Editor */}
        <Panel defaultSize={60} minSize={40} className="bg-white">
          <div className="h-full flex flex-col p-8">
              <div className="mb-6 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Word Count</span>
                       <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-black tabular-nums transition-colors ${wordCount >= targetWords ? "text-green-600" : "text-black"}`}>
                            {wordCount}
                          </span>
                          <span className="text-xs font-bold text-slate-400">/ {targetWords}</span>
                       </div>
                    </div>
                    {/* Word Progress Bar */}
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                       <div 
                         className={`h-full transition-all duration-500 ${wordCount >= targetWords ? "bg-green-500" : "bg-black"}`}
                         style={{ width: `${progressPercentage}%` }}
                       />
                    </div>
                 </div>

                 <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`rounded-full h-9 px-4 text-[10px] uppercase font-bold border-slate-200 transition-all ${isProcessing ? "bg-black text-white" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 size={14} className="mr-2 animate-spin" />
                      ) : (
                        <Scan size={14} className="mr-2" />
                      )}
                      {isProcessing ? "Processing Handwriting..." : "Scan Handwriting"}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500" onClick={() => { setText(""); onChange?.(""); }}>
                      <Trash2 size={16} />
                    </Button>
                 </div>
              </div>

              <div className="flex-grow relative group">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    onChange?.(e.target.value);
                  }}
                  placeholder="Type your essay response here or use the handwriting scanner..."
                  className="w-full h-full resize-none p-10 bg-slate-50/50 border-2 border-transparent focus:border-black rounded-[2.5rem] outline-none text-base leading-loose font-medium text-slate-700 transition-all placeholder:text-slate-300 placeholder:italic"
                />
                <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="secondary" size="sm" className="rounded-full shadow-md text-[10px] font-bold uppercase" onClick={() => navigator.clipboard.writeText(text)}>
                      <Copy size={12} className="mr-2" />
                      Copy Text
                   </Button>
                </div>
              </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
}
