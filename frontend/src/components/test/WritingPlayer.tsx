"use client";

import React, { useRef, useState } from "react";
import {
  Clipboard,
  ClipboardPaste,
  EyeOff,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Send,
  Shuffle,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WritingPlayerProps {
  prompt: string;
  targetWords: number;
  taskType?: "task1" | "task2";
  visualType?: string;
  data?: {
    columns?: string[];
    rows?: string[][];
  };
  essayType?: string;
  onChange?: (text: string) => void;
  onSubmit?: () => void;
}

export function WritingPlayer({
  prompt,
  targetWords,
  taskType,
  visualType,
  data,
  essayType,
  onChange,
  onSubmit,
}: WritingPlayerProps) {
  const [text, setText] = useState("");
  const [showCounter, setShowCounter] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const updateText = (next: string) => {
    setText(next);
    onChange?.(next);
  };

  const cutSelection = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const selected = text.slice(textarea.selectionStart, textarea.selectionEnd);
    if (!selected) return;
    await navigator.clipboard.writeText(selected).catch(() => undefined);
    updateText(text.slice(0, textarea.selectionStart) + text.slice(textarea.selectionEnd));
  };

  const pasteClipboard = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const clipboardText = await navigator.clipboard.readText().catch(() => "");
    if (!clipboardText) return;
    const next = text.slice(0, textarea.selectionStart) + clipboardText + text.slice(textarea.selectionEnd);
    updateText(next);
  };

  return (
    <div className="h-full bg-white flex flex-col text-slate-950">
      <div className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-slate-200">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-black tracking-tight">Write Essay</h1>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {taskType === "task1" ? "Task 1" : "Task 2"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs font-bold text-primary hover:text-primary/80">
            My Saved Essays
          </button>
          <Button
            onClick={onSubmit}
            className="h-9 rounded-md bg-primary px-4 text-xs font-bold text-white gap-2"
          >
            <Send size={15} fill="currentColor" />
            Submit
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-grow p-5">
        <div className="h-full border-2 border-slate-200 rounded-md overflow-hidden grid grid-cols-[315px_minmax(0,1fr)] bg-white">
          <aside className="min-h-0 border-r border-slate-200 flex flex-col">
            <div className="h-14 shrink-0 px-3 flex items-center gap-2 border-b border-slate-200">
              <Button className="h-8 rounded-md bg-primary text-white px-3 text-[11px] font-bold gap-2">
                <Shuffle size={14} />
                Random Prompt
              </Button>
              <Button className="h-8 rounded-md bg-primary text-white px-3 text-[11px] font-bold gap-2">
                <Plus size={14} />
                Custom Prompt
              </Button>
            </div>

            <div className="min-h-0 overflow-y-auto p-4 space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {essayType || visualType || "Writing Prompt"}
                </p>
                <p className="text-[15px] leading-7 font-medium text-slate-900 whitespace-pre-line">
                  {prompt}
                </p>
              </div>

              {data?.columns?.length && data.rows?.length ? (
                <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        {data.columns.map((column) => (
                          <th key={column} className="px-2 py-2 font-black">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-slate-100">
                          {row.map((cell, cellIndex) => (
                            <td key={`${rowIndex}-${cellIndex}`} className="px-2 py-2 font-semibold text-slate-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              <div className="border-t border-slate-200 pt-4 text-xs leading-6 font-medium text-slate-500">
                Write at least <span className="font-black text-slate-900">{targetWords} words</span>.
              </div>
            </div>
          </aside>

          <main className="min-h-0 flex flex-col bg-white">
            <div className="h-12 shrink-0 px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={cutSelection}>
                  <Clipboard size={13} className="mr-1" />
                  Cut
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={pasteClipboard}>
                  <ClipboardPaste size={13} className="mr-1" />
                  Paste
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={() => document.execCommand("undo")}>
                  <Undo2 size={13} className="mr-1" />
                  Undo
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={() => document.execCommand("redo")}>
                  <RotateCcw size={13} className="mr-1" />
                  Redo
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="h-7 w-8 p-0">
                  <RotateCcw size={15} />
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-8 p-0">
                  <MoreHorizontal size={15} />
                </Button>
                {showCounter && (
                  <span className="text-sm font-medium tabular-nums">
                    Word Count: {wordCount}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-bold gap-2"
                  onClick={() => setShowCounter((current) => !current)}
                >
                  <EyeOff size={14} />
                  {showCounter ? "Hide Counter" : "Show Counter"}
                </Button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => updateText(event.target.value)}
              placeholder="Write your essay here..."
              className="min-h-0 flex-grow w-full resize-none border-0 bg-white p-4 font-mono text-base leading-7 text-slate-800 outline-none placeholder:text-slate-400"
            />
          </main>
        </div>
      </div>
    </div>
  );
}
