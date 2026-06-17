"use client";

import React, { useState } from "react";
import { Skill, VideoLecture } from "@/lib/types";
import { useApiData } from "@/lib/api";
import Link from "next/link";
import { Play } from "lucide-react";

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

      {/* LECTURE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredLectures.map((lecture) => {
          return (
            <div key={lecture.id} className="group flex flex-col space-y-4">
              <Link 
                href={`/lectures/${lecture.id}`}
                className="relative aspect-video bg-on-surface flex items-center justify-center rounded-sm overflow-hidden transition-all hover:brightness-110"
              >
                <div className="w-16 h-16 rounded-full bg-surface bg-opacity-20 backdrop-blur-sm flex items-center justify-center border border-surface border-opacity-30 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-surface fill-current ml-1" />
                </div>
                
                {/* Underline progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-20">
                  <div 
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${lecture.progress}%` }}
                  />
                </div>
              </Link>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-[15px] font-semibold text-on-surface tracking-tight leading-tight uppercase underline-offset-4 group-hover:underline">
                    {lecture.title}
                  </h3>
                  <span className="text-xs font-light text-secondary whitespace-nowrap">Band {lecture.bandRange}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-semibold px-2 py-0.5 border border-outline-variant rounded-full text-secondary uppercase tracking-widest">
                     {lecture.skill}
                   </span>
                   <span className="text-[10px] font-medium text-outline uppercase tracking-widest">
                     {lecture.duration}
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
