"use client";

import React, { useState, useRef } from "react";
import { Mic, Square, Trash2, Download, CheckCircle2, AlertCircle } from "lucide-react";

interface SpeakingPlayerProps {
  question: string;
  part: number;
}

export function SpeakingPlayer({ question, part }: SpeakingPlayerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new MediaRecorder(userStream);
      mediaRecorder.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        userStream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to record your speaking part.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 p-8">
      <div className="max-w-2xl w-full flex flex-col gap-12 text-center">
        <div className="space-y-4">
           <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em]">
             Part {part}: Long Turn
           </span>
           <h2 className="text-3xl font-bold tracking-tight text-slate-800 leading-tight">
             {question}
           </h2>
        </div>

        <div className="relative aspect-video max-w-sm mx-auto w-full bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col items-center justify-center gap-8 overflow-hidden">
          {/* Animated Background Pulse */}
          {isRecording && (
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
               <div className="flex items-center justify-center h-full">
                  <div className="w-48 h-48 rounded-full border border-red-500/10 animate-ping" />
                  <div className="absolute w-64 h-64 rounded-full border border-red-500/5 animate-ping delay-700" />
               </div>
            </div>
          )}

          <div className="relative z-10 space-y-4">
             <div className="text-5xl font-mono font-black text-slate-900 tabular-nums tracking-tighter">
                {formatTime(recordingTime)}
             </div>
             <p className={`text-[10px] font-bold uppercase tracking-widest ${isRecording ? "text-red-500 animate-bounce" : "text-slate-400"}`}>
               {isRecording ? "• Recording in Progress" : "Ready to start"}
             </p>
          </div>

          {!audioUrl || isRecording ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 group ${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-black hover:bg-slate-800 text-white"
              }`}
            >
               {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} className="group-hover:scale-110 transition-transform" />}
            </button>
          ) : (
            <div className="relative z-10 flex flex-col items-center gap-4">
               <div className="flex gap-4">
                  <button 
                    onClick={() => { setAudioUrl(null); setRecordingTime(0); }}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                  <a 
                    href={audioUrl} 
                    download={`speaking-part-${part}.webm`}
                    className="h-12 px-8 rounded-full bg-black hover:bg-slate-800 text-white font-bold inline-flex items-center justify-center transition-all shadow-lg active:scale-95"
                   >
                        <Download size={18} className="mr-2" />
                        Download Answer
                   </a>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                  <CheckCircle2 size={12} />
                  Answer Captured
               </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4 text-left shadow-sm">
           <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
           <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest underline underline-offset-4">Exam Note:</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                In the actual exam, you should speak for 1-2 minutes. Your recording will be processed locally and never leaves your device.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
