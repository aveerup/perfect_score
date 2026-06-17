"use client";

import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/lib/hooks";

interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const { isPremium } = usePremium();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative group/gate">
      <div className="filter blur-[6px] select-none pointer-events-none transition-all duration-500">
        {children}
      </div>
      
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-surface bg-opacity-20 backdrop-blur-[2px]">
        <div className="bg-surface border border-primary p-8 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-tight text-on-surface italic">Premium Feature</h3>
            <p className="text-xs font-light text-secondary">
              Unlock advanced analysis, unlimited mock tests, and full error logs with a Pro subscription.
            </p>
          </div>
          <Button className="w-full h-12 bg-primary text-on-primary font-bold uppercase tracking-widest text-[10px] rounded-sm">
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
}
