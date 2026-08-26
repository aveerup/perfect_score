"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Mic, Play, RotateCcw, Square } from "lucide-react";
import { TestQuestion } from "@/lib/types";

interface SpeakingPlayerProps {
  question: TestQuestion;
  value: string;
  recording?: Blob;
  onMcqChange: (questionId: string, value: string) => void;
  onRecordingChange: (questionId: string, recording: Blob) => void;
}

export function SpeakingPlayer({
  question,
  value,
  recording,
  onMcqChange,
  onRecordingChange,
}: SpeakingPlayerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioUrl = useMemo(() => (recording ? URL.createObjectURL(recording) : null), [recording]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopRecording = () => {
    if (!mediaRecorder.current || !isRecording) return;
    mediaRecorder.current.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startRecording = async () => {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        onRecordingChange(question.id, blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecordingTime(0);
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime((current) => current + 1);
      }, 1000);
    } catch {
      window.alert("Please allow microphone access to record your speaking answer.");
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isMcq = Boolean(question.options?.length);

  return (
    <div className="h-full overflow-y-auto bg-[#F8FAFC] px-6 py-10 lg:px-10 lg:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(360px,0.92fr)_minmax(500px,1.08fr)] xl:gap-10">
        <section className="border border-slate-200 bg-white p-7 lg:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            Question {question.label ?? question.number}
          </p>
          {question.superCategory && (
            <p className="mt-4 text-xs font-black uppercase tracking-widest text-primary">
              {question.superCategory}
            </p>
          )}
          {question.title && (
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {question.title}
            </h2>
          )}
          {question.theme && (
            <p className="mt-4 text-base font-bold text-slate-500">Theme: {question.theme}</p>
          )}
          {question.rules?.length ? (
            <div className="mt-8 border border-amber-100 bg-amber-50 p-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-700">
                <AlertCircle className="h-4 w-4" />
                Rules
              </div>
              <ul className="mt-4 space-y-3 text-base font-semibold leading-7 text-amber-900">
                {question.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="border border-slate-200 bg-white p-7 lg:p-10">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            {isMcq ? "Choose one answer" : "Record your answer"}
          </p>
          <h3 className="mt-4 text-3xl font-black leading-tight text-slate-950 lg:text-4xl">
            {question.prompt}
          </h3>

          {isMcq ? (
            <div className="mt-9 grid gap-4">
              {question.options?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onMcqChange(question.id, option)}
                  className={`border-2 p-5 text-left text-base font-black transition-colors ${
                    value === option
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-9 space-y-7">
              <div className="border border-slate-100 bg-slate-50 p-7 text-center lg:p-9">
                <p className="font-mono text-6xl font-black tabular-nums text-slate-950">
                  {formatTime(recordingTime)}
                </p>
                <p className={`mt-3 text-xs font-black uppercase tracking-widest ${isRecording ? "text-red-500" : "text-slate-400"}`}>
                  {isRecording ? "Recording in progress" : recording ? "Answer recorded" : "Ready"}
                </p>

                <div className="mt-7 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95 ${
                      isRecording ? "bg-red-500 hover:bg-red-600" : "bg-slate-950 hover:bg-slate-800"
                    }`}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                  >
                    {isRecording ? <Square className="h-8 w-8" fill="currentColor" /> : <Mic className="h-8 w-8" />}
                  </button>

                  {recording && !isRecording && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex h-12 items-center gap-2 border border-slate-200 bg-white px-4 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Re-record
                    </button>
                  )}
                </div>
              </div>

              {audioUrl && (
                <div className="border border-emerald-100 bg-emerald-50 p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Captured
                  </div>
                  <audio controls src={audioUrl} className="w-full" />
                </div>
              )}

              {recording && question.modelAnswer && (
                <div className="border border-slate-200 bg-white p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
                    <Play className="h-4 w-4" />
                    Model Answer
                  </div>
                  <p className="text-base font-semibold leading-8 text-slate-700">{question.modelAnswer}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
