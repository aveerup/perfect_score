"use client";

import React, { useState } from "react";
import { Skill, VideoLecture } from "@/lib/types";
import { useApiData } from "@/lib/api";
import Link from "next/link";

export default function LecturesHomePage() {
  const [activeFilter, setActiveFilter] = useState<Skill | "All">("All");
  const { data: videos, loading, error } = useApiData<VideoLecture[]>("/lectures", []);

  const filteredLectures = videos.filter(v => activeFilter === "All" || v.skill === activeFilter);

  if (loading) return <div className="py-20 text-center text-secondary">Loading lectures...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-10 animate-in pb-12">
      <header className="space-y-1">
        <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest">Video Masterclasses</p>
        <h1 className="text-3xl font-semibold text-on-surface tracking-tight">High-Density Learning</h1>
      </header>

      {/* FILTER STRIP */}
      <div className="border-b border-border -mx-6 px-6">
        <div className="flex gap-8 h-12">
          {["All", "Listening", "Reading", "Writing", "Speaking"].map((label) => {
            const filterVal = label === "All" ? "All" : label[0] as Skill;
            const isActive = activeFilter === filterVal;
            return (
              <button
                key={label}
                onClick={() => setActiveFilter(filterVal)}
                className={`h-full px-1 text-sm font-medium tracking-widest uppercase relative transition-colors ${
                  isActive ? "text-on-surface" : "text-secondary hover:text-on-surface"
                }`}
              >
                {label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary animate-in" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* LECTURE LIST */}
      <div className="divide-y divide-border border-y border-border">
        {filteredLectures.map((lecture) => {
          return (
            <Link
              key={lecture.id}
              href={`/lectures/${lecture.id}`}
              className="group grid gap-3 py-5 transition-colors hover:bg-surface-container sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0 space-y-2">
                <h3 className="text-[15px] font-semibold text-on-surface tracking-tight leading-tight uppercase underline-offset-4 group-hover:underline">
                  {lecture.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 border border-outline-variant rounded-full text-secondary uppercase tracking-widest">
                    {lecture.skill}
                  </span>
                  <span className="text-[10px] font-medium text-outline uppercase tracking-widest">
                    {lecture.duration}
                  </span>
                </div>
              </div>
              <span className="text-xs font-light text-secondary whitespace-nowrap sm:text-right">
                Band {lecture.bandRange}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
