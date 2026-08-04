"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Headphones
} from "lucide-react";

interface ListeningPlayerProps {
  audioUrl: string;
  segments: { id: string; label: string; timestamp: number }[];
  questions: React.ReactNode;
}

export function ListeningPlayer({ audioUrl, segments, questions }: ListeningPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioError("");
    };

    const onError = () => {
      setIsPlaying(false);
      setAudioError("Audio is unavailable. Check the Supabase Storage bucket, file path, and signed URL access.");
    };

    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) {
      setAudioError("Audio is unavailable. Check the Supabase Storage bucket, file path, and signed URL access.");
      return;
    }

    try {
      await audio.play();
      setAudioError("");
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setAudioError("Audio is unavailable. Check the Supabase Storage bucket, file path, and signed URL access.");
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    void playAudio();
  };

  const jumpTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      if (!isPlaying) {
        void playAudio();
      }
    }
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F8FAFC]">
      <audio ref={audioRef} src={audioUrl || undefined} preload="metadata" />
      
      {/* Premium Floating Audio Bar */}
      <div className="mx-auto w-full max-w-2xl mt-8 px-6">
        <div className="bg-black text-white p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border border-white/10 ring-8 ring-black/5">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? "bg-white/20 animate-pulse" : "bg-white/10"}`}>
                   <Headphones size={20} className="text-white" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global Exam Audio</p>
                   <p className="text-sm font-bold tracking-tight">IELTS LISTENING COMPLETE TRACK</p>
                </div>
             </div>
             <div className="text-[10px] font-mono font-bold text-white/60 bg-white/5 px-2 py-1 rounded">
                {formatTime(currentTime)} / {formatTime(duration)}
             </div>
          </div>

          <div className="relative group">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer">
               <div 
                 className="h-full bg-white transition-all duration-300 relative"
                 style={{ width: `${progress}%` }}
               >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
               </div>
            </div>
            
            {/* Segment Markers on Timeline */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
               {segments.map((s) => (
                 <div 
                   key={s.id}
                   className="absolute h-full w-0.5 bg-white/30"
                   style={{ left: `${duration ? (s.timestamp / duration) * 100 : 0}%` }}
                   title={s.label}
                 />
               ))}
            </div>
          </div>

          {audioError && (
            <p className="text-[11px] font-semibold text-red-200 bg-red-500/15 border border-red-300/20 px-3 py-2 rounded-lg">
              {audioError}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
               <button 
                 onClick={togglePlay}
                 className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
               >
                 {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
               </button>
               <button 
                 onClick={() => jumpTo(Math.max(0, (audioRef.current?.currentTime || 0) - 10))}
                 className="text-white/60 hover:text-white flex flex-col items-center gap-1"
               >
                 <RotateCcw size={16} />
                 <span className="text-[8px] font-bold uppercase">10s</span>
               </button>
            </div>

            <div className="flex gap-2">
               {segments.map((s, i) => (
                 <button
                   key={s.id}
                   onClick={() => jumpTo(s.timestamp)}
                   className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-tight transition-all"
                 >
                   Sec {i + 1}
                 </button>
               ))}
            </div>

            <div className="flex items-center gap-2">
               <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
                 {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
           {questions}
        </div>
      </div>
    </div>
  );
}
