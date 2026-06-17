"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { 
  ArrowLeft, 
  Play, 
  Mic, 
  Calendar as CalendarIcon
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetBand, setTargetBand] = useState(7.5);
  const [examDate, setExamDate] = useState("");
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, string>>({});
  const [estimatedBand, setEstimatedBand] = useState(6.0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const finishDiagnostic = async () => {
    if (!examDate) {
      setError("Choose your exam date before continuing.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await api.post<{ diagnostic: { estimatedBand: number } }>("/onboarding/diagnostic", {
        targetBand,
        examDate,
        diagnosticAnswers,
      });
      setEstimatedBand(result.diagnostic.estimatedBand);
      nextStep();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save onboarding");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center animate-in">
      {/* TOP NAV: PROGRESS & BACK */}
      <header className="w-full max-w-4xl h-24 flex items-center justify-between px-6 shrink-0">
        <button 
          onClick={prevStep}
          className={`text-secondary hover:text-on-surface transition-colors ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
        >
          <ArrowLeft className="w-6 h-6 border rounded-full p-1 border-border" />
        </button>
        
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i <= step ? "bg-primary" : "border border-outline-variant"
              }`}
            />
          ))}
        </div>
        
        <div className="w-6" /> {/* Spacer */}
      </header>

      {/* CONTENT AREA */}
      <main className="flex-grow w-full max-w-2xl px-6 flex flex-col justify-center pb-24">
        {step === 1 && (
          <div className="space-y-8 text-center animate-in">
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-secondary uppercase tracking-[0.2em] italic">Initial Assessment</p>
              <h1 className="text-4xl md:text-5xl font-semibold text-on-surface tracking-tighter leading-none">Let&apos;s find your starting point.</h1>
              <p className="text-sm font-light text-secondary max-w-md mx-auto">This diagnostic will estimate your current band level to build your optimal study plan. Takes 8 minutes.</p>
            </div>
            <Button 
               onClick={nextStep}
               className="h-16 px-12 rounded-sm bg-primary text-on-primary font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
            >
              Begin Diagnostic
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in">
             <div className="space-y-2">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Part 1: Reading Skill</p>
                <h2 className="text-xl font-medium text-on-surface">Choose the correct title for the passage snippet.</h2>
             </div>
             <div className="bg-surface-container-low p-8 border border-border text-sm font-light leading-relaxed text-secondary italic">
               &quot;The rapid deployment of renewable energy technologies is not only a climate necessity but also an economic opportunity for developing nations seeking grid stability...&quot;
             </div>
             <div className="grid grid-cols-1 gap-3">
               {["Energy security and economic growth", "The challenges of grid stability", "Global climate policy update"].map(opt => (
                 <button key={opt} onClick={() => { setDiagnosticAnswers((value) => ({ ...value, reading: opt })); nextStep(); }} className="w-full p-5 text-left border border-border hover:border-primary transition-all text-xs font-medium uppercase tracking-tight">
                   {opt}
                 </button>
               ))}
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in">
             <div className="space-y-2">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Part 2: Listening Skill</p>
                <h2 className="text-xl font-medium text-on-surface">Listen and identify the target location.</h2>
             </div>
             <div className="bg-on-surface p-8 border border-border flex items-center justify-center gap-4">
                <Play className="text-surface w-8 h-8 fill-current" />
                <div className="flex-1 h-0.5 bg-surface bg-opacity-30">
                   <div className="w-1/3 h-full bg-surface" />
                </div>
                <span className="text-[10px] font-mono text-surface">0:12 / 0:45</span>
             </div>
             <div className="space-y-4">
                <input type="text" onChange={(event) => setDiagnosticAnswers((value) => ({ ...value, listening: event.target.value }))} className="w-full border-b-2 border-border focus:border-primary transition-colors py-4 text-3xl font-light italic outline-none uppercase placeholder:text-outline-variant" placeholder="Type here..." />
                <Button onClick={nextStep} className="w-full h-14 bg-primary text-on-primary uppercase tracking-widest text-xs font-bold">Continue</Button>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-in flex flex-col items-center">
             <div className="text-center space-y-4">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Part 3: Speaking Assessment</p>
                <h2 className="text-2xl font-semibold text-on-surface">Describe your favorite childhood memory.</h2>
             </div>
             <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center relative">
                <Mic className="w-10 h-10 text-primary" />
                <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-20" />
             </div>
             <div className="text-center space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface">Recording... 00:44</p>
                <p className="text-[10px] font-light text-secondary lowercase">Speak for at least 60 seconds</p>
             </div>
             <Button onClick={nextStep} variant="outline" className="border-border uppercase tracking-widest text-[10px] h-10 px-8">Skip for now</Button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-12 animate-in">
             <div className="space-y-6">
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Goal Setting</p>
                   <h2 className="text-2xl font-semibold text-on-surface leading-tight">What band score do you need?</h2>
                </div>
                <div className="flex items-center gap-8">
                   <input 
                      type="range" min="5.0" max="9.0" step="0.5" 
                      value={targetBand} 
                      onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                      className="flex-1 accent-primary" 
                   />
                   <span className="text-5xl font-bold italic w-20 text-right">{targetBand.toFixed(1)}</span>
                </div>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <h2 className="text-2xl font-semibold text-on-surface leading-tight">When is your exam?</h2>
                </div>
                <div className="flex items-center gap-4 border-b border-border py-4">
                   <CalendarIcon className="w-5 h-5 text-secondary" />
                   <input 
                      type="date" 
                      className="flex-1 bg-transparent text-lg font-light outline-none" 
                      onChange={(e) => setExamDate(e.target.value)}
                   />
                </div>
             </div>

             {error && <p className="text-sm text-error">{error}</p>}
             <Button disabled={saving} onClick={() => void finishDiagnostic()} className="w-full h-16 bg-primary text-on-primary uppercase tracking-widest text-sm font-bold">{saving ? "Saving..." : "Calculate Results"}</Button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-12 animate-in text-center">
             <div className="space-y-8">
                <div className="space-y-2">
                   <p className="text-[11px] font-bold text-secondary uppercase tracking-widest italic">Diagnostic Result</p>
                   <div className="text-[120px] leading-none font-bold tracking-tighter text-on-surface italic">{estimatedBand.toFixed(1)}</div>
                   <p className="text-sm font-light text-secondary">Estimated Starting Band</p>
                </div>

                <div className="p-8 border border-primary bg-surface-container-low rounded-sm space-y-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 bg-primary text-on-primary px-3 py-1 text-[9px] font-bold uppercase tracking-widest">Recommended</div>
                   <h3 className="text-xl font-bold text-on-surface uppercase tracking-tight italic">1-Month Balanced Plan</h3>
                   <p className="text-xs font-light text-secondary leading-relaxed">Your plan targets Band {targetBand.toFixed(1)} by {examDate} and starts with balanced work across all four skills.</p>
                </div>
             </div>

             <div className="space-y-4 pt-8">
                <Button 
                   onClick={() => router.push('/dashboard')}
                   className="w-full h-16 bg-primary text-on-primary uppercase tracking-widest text-sm font-bold"
                >
                  Start this plan
                </Button>
                <a href="#" className="block text-xs font-medium underline underline-offset-4 text-on-surface hover:text-secondary transition-colors uppercase tracking-widest">
                  Choose a different plan
                </a>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
