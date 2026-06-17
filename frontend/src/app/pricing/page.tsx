"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Minus } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = {
    free: {
      name: "Free",
      price: "0",
      desc: "Essential tools for casual preparation.",
      cta: "Get Started",
      features: [
        "Diagnostic Test",
        "Limited Practice Questions (100+)",
        "Core Vocabulary Categories",
        "Basic Performance Dashboard",
        "Community Support",
      ],
    },
    premium: {
      name: "Premium",
      price: billingCycle === "monthly" ? "29" : "24",
      desc: "Full access for serious Band 8+ candidates.",
      cta: "Get Premium",
      features: [
        "Everything in Free",
        "Unlimited Practice Questions (5000+)",
        "Advanced Vocabulary & Collocations",
        "6 Full-Length Mock Tests",
        "Algorithmic Study Plan",
        "Priority Support",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* HEADER & TOGGLE */}
        <section className="py-24 text-center space-y-8 animate-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-semibold text-on-surface uppercase tracking-tight">Simple Pricing</h1>
            <p className="text-xl font-light text-secondary">Choose the path that fits your ambition.</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-on-surface font-medium" : "text-secondary font-light"}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="w-12 h-6 bg-secondary-container rounded-full relative transition-colors"
            >
              <div className={`absolute top-1 w-4 h-4 bg-primary rounded-full transition-all ${billingCycle === "annual" ? "left-7" : "left-1"}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${billingCycle === "annual" ? "text-on-surface font-medium" : "text-secondary font-light"}`}>Annual</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-primary text-on-primary px-2 py-0.5 rounded-full">Save 20%</span>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="max-w-5xl mx-auto px-4 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FREE CARD */}
            <div className="bg-surface border border-border p-10 rounded-sm space-y-8 flex flex-col">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-on-surface uppercase tracking-tight">{plans.free.name}</h3>
                <p className="text-sm font-light text-secondary">{plans.free.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tighter">$0</span>
                <span className="text-secondary font-light">/month</span>
              </div>
              <ul className="space-y-4 flex-grow">
                {plans.free.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-light text-on-surface">
                    <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full h-12 rounded-sm border-primary text-primary hover:bg-surface-container-low transition-colors font-semibold uppercase tracking-wider">
                {plans.free.cta}
              </Button>
            </div>

            {/* PREMIUM CARD */}
            <div className="bg-primary text-on-primary border border-primary p-10 rounded-sm space-y-8 flex flex-col">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold uppercase tracking-tight">{plans.premium.name}</h3>
                <p className="text-sm font-light opacity-70">{plans.premium.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tighter">${plans.premium.price}</span>
                <span className="opacity-70 font-light">/month</span>
              </div>
              <ul className="space-y-4 flex-grow">
                {plans.premium.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-light">
                    <Check className="w-4 h-4 text-on-primary" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full h-12 rounded-sm bg-on-primary text-primary hover:bg-secondary-container transition-colors font-semibold uppercase tracking-wider">
                {plans.premium.cta}
              </Button>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="max-w-5xl mx-auto px-4 pb-32 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-on-surface uppercase tracking-tight mb-12 text-center">Feature Comparison</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-6 text-sm font-semibold uppercase tracking-widest text-secondary">Feature</th>
                <th className="py-6 text-center text-sm font-semibold uppercase tracking-widest text-on-surface">Free</th>
                <th className="py-6 text-center text-sm font-semibold uppercase tracking-widest text-on-surface">Premium</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-on-surface">
              <ComparisonRow label="Diagnostic Test" free={<Check className="w-4 h-4 mx-auto" />} premium={<Check className="w-4 h-4 mx-auto" />} />
              <ComparisonRow label="Practice Questions" free="100+ Questions" premium="Unlimited (5000+)" />
              <ComparisonRow label="Video Lectures" free="Demo Only" premium="All Masterclasses" />
              <ComparisonRow label="Vocabulary Builder" free="Core Concepts" premium="Advanced + Collocations" />
              <ComparisonRow label="Mock Tests" free={<Minus className="w-4 h-4 mx-auto text-outline" />} premium="6 Full Tests" />
              <ComparisonRow label="Digital Interface" free={<Check className="w-4 h-4 mx-auto" />} premium={<Check className="w-4 h-4 mx-auto" />} />
              <ComparisonRow label="Error Log" free={<Minus className="w-4 h-4 mx-auto text-outline" />} premium={<Check className="w-4 h-4 mx-auto" />} />
              <ComparisonRow label="Personal Study Plan" free={<Minus className="w-4 h-4 mx-auto text-outline" />} premium={<Check className="w-4 h-4 mx-auto" />} />
              <ComparisonRow label="Performance Analytics" free="Basic" premium="Advanced AI Insight" />
            </tbody>
          </table>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ComparisonRow({ label, free, premium }: { label: string, free: React.ReactNode, premium: React.ReactNode }) {
  return (
    <tr className="border-b border-border group transition-colors hover:bg-surface-container-lowest">
      <td className="py-5 font-medium">{label}</td>
      <td className="py-5 text-center text-secondary">{free}</td>
      <td className="py-5 text-center font-medium">{premium}</td>
    </tr>
  );
}
