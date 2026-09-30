"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowLeft, ArrowUp, Copy, ImagePlus, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { api, invalidateApiCache, useApiData } from "@/lib/api";
import {
  GAP_MARKER,
  letterLabel,
  READING_MODIFIED_PREFIX,
  ReadingComponent,
  ReadingImage,
  ReadingSet,
  totalQuestions,
} from "@/lib/reading-modified";
import { ReadingMarkdown } from "@/components/reading/ReadingMarkdown";
import { PracticeQuestionSet } from "@/lib/types";

type Skill = "reading" | "writing" | "speaking" | "listening";
type Editor = { id: string | null; title: string; components: ReadingComponent[]; isPublished: boolean };

const skills: { key: Skill; label: string }[] = [
  { key: "reading", label: "Reading" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
  { key: "listening", label: "Listening" },
];

const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-primary";
const lightButton = "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:border-primary hover:text-primary";

export function ReadingSetManager() {
  const [skill, setSkill] = useState<Skill>("reading");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { data: sets, setData: setSets, loading, error: loadError } = useApiData<ReadingSet[]>("/admin/reading-sets", []);
  const { data: images, setData: setImages, error: imageError } = useApiData<ReadingImage[]>("/admin/reading-images", []);
  const { data: existingPractice, loading: existingLoading, error: existingError } = useApiData<PracticeQuestionSet[]>("/practice", []);
  const existingSkillCode = { writing: "W", speaking: "S", listening: "L" } as const;

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!error) return;
    const timeout = window.setTimeout(() => setError(""), 8000);
    return () => window.clearTimeout(timeout);
  }, [error]);

  const updateComponents = (updater: (components: ReadingComponent[]) => ReadingComponent[]) => {
    setEditor((current) => current ? { ...current, components: updater(current.components) } : current);
  };

  const updateComponent = (componentId: string, updater: (component: ReadingComponent) => ReadingComponent) => {
    updateComponents((components) => components.map((component) => component.id === componentId ? updater(component) : component));
  };

  const addComponent = (type: ReadingComponent["type"]) => {
    let component: ReadingComponent;
    if (type === "passage") {
      component = { id: crypto.randomUUID(), type, markdown: "" };
    } else if (type === "fillGaps") {
      component = { id: crypto.randomUUID(), type, heading: "", answerEnabled: false, questions: [] };
    } else if (type === "mcq") {
      component = { id: crypto.randomUUID(), type, heading: "", answerEnabled: false, questions: [] };
    } else {
      component = { id: crypto.randomUUID(), type, heading: "", answerEnabled: false, questions: [], endings: [] };
    }
    updateComponents((components) => [...components, component]);
  };

  const moveComponent = (index: number, direction: -1 | 1) => {
    updateComponents((components) => {
      const next = [...components];
      const target = index + direction;
      if (target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const openNew = () => {
    setEditor({ id: null, title: "", components: [], isPublished: false });
    setError("");
    setNotice("");
  };

  const openEdit = (set: ReadingSet) => {
    setEditor({ id: set.id, title: set.title, components: structuredClone(set.components), isPublished: set.isPublished });
    setError("");
    setNotice("");
  };

  const validate = (publish: boolean): string | null => {
    if (!editor?.title.trim()) return "Enter a title first.";
    if (!publish) return null;
    if (totalQuestions(editor.components) === 0) return "Add at least one question before publishing.";
    for (const component of editor.components) {
      if (component.type === "fillGaps") {
        for (const question of component.questions) {
          if (question.text.split(GAP_MARKER).length !== 2) {
            return `Every fill gaps question must contain exactly one ${GAP_MARKER} marker.`;
          }
          if (component.answerEnabled && !question.answer.trim()) return "Fill in every enabled answer before publishing.";
        }
      }
      if (component.type === "mcq") {
        for (const question of component.questions) {
          if (!question.text.trim()) return "Enter text for every MCQ before publishing.";
          if (question.options.length < 2) return "Add at least two options to every MCQ before publishing.";
          if (question.options.some((option) => !option.text.trim())) return "Fill in every MCQ option before publishing.";
          if (component.answerEnabled && !question.correctOptionId) {
            return "Select one correct option for every MCQ before publishing.";
          }
        }
      }
      if (component.type === "completeSentence") {
        for (const question of component.questions) {
          if (!question.text.trim()) return "Enter text for every complete sentence question before publishing.";
          if (component.answerEnabled && !question.correctEndingId) {
            return "Select one remaining sentence for every enabled answer before publishing.";
          }
        }
        if (component.questions.length && !component.endings.length) return "Add at least one remaining sentence before publishing.";
        if (component.endings.some((ending) => !ending.text.trim())) return "Fill in every remaining sentence before publishing.";
      }
    }
    return null;
  };

  const save = async (publish: boolean) => {
    if (!editor) return;
    const validationError = validate(publish);
    if (validationError) { setError(validationError); return; }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = { title: editor.title.trim(), components: editor.components, isPublished: publish };
      const saved = editor.id
        ? await api.put<ReadingSet>(`/admin/reading-sets/${editor.id.replace(READING_MODIFIED_PREFIX, "")}`, payload)
        : await api.post<ReadingSet>("/admin/reading-sets", payload);
      setSets((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
      invalidateApiCache("/practice");
      setEditor({ id: saved.id, title: saved.title, components: saved.components, isPublished: saved.isPublished });
      setNotice(publish ? "Reading set published." : "Draft saved.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save reading set.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (set: ReadingSet) => {
    if (!window.confirm(`Delete “${set.title}”? Students will no longer see this set.`)) return;
    setError("");
    try {
      await api.delete(`/admin/reading-sets/${set.id.replace(READING_MODIFIED_PREFIX, "")}`);
      setSets((current) => current.filter((item) => item.id !== set.id));
      invalidateApiCache("/practice");
      if (editor?.id === set.id) setEditor(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete reading set.");
    }
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const image = await api.postForm<ReadingImage>("/admin/reading-images", form);
      setImages((current) => [image, ...current]);
      setNotice("Image uploaded. Copy its link into your passage Markdown.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Image link copied. Use it as ![description](link) in the passage.");
    } catch {
      setError("Could not copy the link. Check browser clipboard permission.");
    }
  };

  let questionNumber = 0;

  return (
    <div className="p-5 md:p-8">
      <div aria-live="polite" className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-md flex-col gap-3">
        {notice && (
          <div role="status" className="pointer-events-auto flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800 shadow-xl">
            <span className="min-w-0 flex-1">{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Close success message" className="shrink-0 rounded-md p-1 text-green-700 hover:bg-green-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {error && (
          <div role="alert" className="pointer-events-auto flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-xl">
            <span className="min-w-0 flex-1">{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Close error message" className="shrink-0 rounded-md p-1 text-red-700 hover:bg-red-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-5">
        {skills.map((item) => (
          <button key={item.key} type="button" onClick={() => { setSkill(item.key); setEditor(null); setError(""); }}
            className={`rounded-xl px-5 py-3 text-sm font-black ${skill === item.key ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {skill !== "reading" ? (
        <div className="py-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div><h2 className="text-xl font-black text-slate-900">{skills.find((item) => item.key === skill)?.label} sets</h2>
              <p className="mt-1 text-sm text-slate-500">The builder and editing tools for this skill will be added later.</p></div>
            <button type="button" disabled className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-400">Add a set</button>
          </div>
          {existingLoading ? <p className="py-10 text-center text-sm text-slate-400">Loading existing sets...</p>
            : existingError ? <p className="py-10 text-center text-sm text-red-600">{existingError}</p>
              : existingPractice.filter((item) => item.skill === existingSkillCode[skill]).length ? (
                <div className="divide-y divide-slate-100 border-y border-slate-100">
                  {existingPractice.filter((item) => item.skill === existingSkillCode[skill]).map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center gap-3 py-4">
                      <p className="min-w-0 flex-1 truncate font-black text-slate-900">{item.title}</p>
                      <button type="button" disabled className="inline-flex items-center gap-2 rounded-xl border border-slate-100 px-4 py-2 text-xs font-black text-slate-300"><Pencil className="h-4 w-4" /> Edit</button>
                      <button type="button" disabled className="inline-flex items-center gap-2 rounded-xl border border-slate-100 px-4 py-2 text-xs font-black text-slate-300"><Trash2 className="h-4 w-4" /> Delete</button>
                    </div>
                  ))}
                </div>
              ) : <p className="py-10 text-center text-sm text-slate-400">No existing sets.</p>}
        </div>
      ) : editor ? (
        <div className="mx-auto max-w-5xl space-y-7 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button type="button" onClick={() => setEditor(null)} className={lightButton}><ArrowLeft className="h-4 w-4" /> All reading sets</button>
            <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${editor.isPublished ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
              {editor.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Practice set title</span>
            <input className={`${fieldClass} text-xl font-black`} value={editor.title} maxLength={200}
              onChange={(event) => setEditor({ ...editor, title: event.target.value })} placeholder="Enter a reading practice title" />
          </label>

          <div className="space-y-5">
            {editor.components.map((component, index) => (
              <section key={component.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 md:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Part {index + 1}</p>
                    <h3 className="mt-1 text-lg font-black text-slate-900">{component.type === "passage" ? "Passage" : component.type === "fillGaps" ? "Fill gaps" : component.type === "mcq" ? "MCQ" : "Complete sentence"}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className={lightButton} disabled={index === 0} onClick={() => moveComponent(index, -1)} aria-label="Move part up"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" className={lightButton} disabled={index === editor.components.length - 1} onClick={() => moveComponent(index, 1)} aria-label="Move part down"><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" className={lightButton} onClick={() => updateComponents((items) => items.filter((item) => item.id !== component.id))} aria-label="Remove part"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                {component.type === "passage" ? (
                  <div className="space-y-5">
                    <label className="block space-y-2">
                      <span className="text-xs font-bold uppercase text-slate-500">Passage Markdown</span>
                      <textarea className={`${fieldClass} min-h-56 font-mono`} value={component.markdown}
                        onChange={(event) => updateComponent(component.id, (item) => item.type === "passage" ? { ...item, markdown: event.target.value } : item)}
                        placeholder="Write the passage here. Add images with ![description](image-link)." />
                    </label>
                    {component.markdown && <div className="rounded-xl border border-slate-200 bg-white p-5"><ReadingMarkdown content={component.markdown} /></div>}
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div><h4 className="font-black text-slate-900">Passage images</h4><p className="text-xs text-slate-500">Copy a link and use it in Markdown as ![description](link).</p></div>
                        <label className={`${lightButton} cursor-pointer`}><ImagePlus className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload image"}
                          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload} disabled={uploading} className="sr-only" />
                        </label>
                      </div>
                      {imageError && <p className="mt-3 text-xs text-red-600">{imageError}</p>}
                      <div className="mt-4 max-h-52 divide-y divide-slate-100 overflow-y-auto border-t border-slate-100">
                        {images.length ? images.map((image) => (
                          <div key={image.id} className="flex items-center gap-3 py-3">
                            <Image src={image.url} alt="" width={48} height={48} unoptimized className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                            <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700" title={image.filename}>{image.filename}</span>
                            <button type="button" className={lightButton} onClick={() => void copyLink(image.url)}><Copy className="h-4 w-4" /> Copy link</button>
                          </div>
                        )) : <p className="py-5 text-sm text-slate-400">No images uploaded yet.</p>}
                      </div>
                    </div>
                  </div>
                ) : component.type === "fillGaps" ? (
                  <div className="space-y-5">
                    <label className="block space-y-2">
                      <span className="text-xs font-bold uppercase text-slate-500">Heading / instructions (Markdown)</span>
                      <textarea className={`${fieldClass} min-h-28 font-mono`} value={component.heading}
                        onChange={(event) => updateComponent(component.id, (item) => item.type === "fillGaps" ? { ...item, heading: event.target.value } : item)}
                        placeholder="Describe what students need to do." />
                    </label>
                    {component.heading && <div className="rounded-xl border border-slate-200 bg-white p-5"><ReadingMarkdown content={component.heading} /></div>}
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Questions</p>
                      {component.questions.map((question) => {
                        const number = ++questionNumber;
                        return (
                          <div key={question.id} className="flex items-start gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{number}</span>
                            <textarea className={`${fieldClass} min-h-20 flex-1 font-mono`} value={question.text}
                              onChange={(event) => updateComponent(component.id, (item) => item.type === "fillGaps" ? { ...item, questions: item.questions.map((q) => q.id === question.id ? { ...q, text: event.target.value } : q) } : item)}
                              placeholder={`My name is ${GAP_MARKER}.`} />
                            <button type="button" className={lightButton} aria-label={`Remove question ${number}`}
                              onClick={() => updateComponent(component.id, (item) => item.type === "fillGaps" ? { ...item, questions: item.questions.filter((q) => q.id !== question.id) } : item)}><Trash2 className="h-4 w-4" /></button>
                          </div>
                        );
                      })}
                      <button type="button" className={lightButton} onClick={() => updateComponent(component.id, (item) => item.type === "fillGaps" ? { ...item, questions: [...item.questions, { id: crypto.randomUUID(), text: "", answer: "" }] } : item)}>
                        <Plus className="h-4 w-4" /> Add question
                      </button>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <label className="flex cursor-pointer items-center gap-3 text-sm font-black text-slate-800">
                        <input type="checkbox" checked={component.answerEnabled} className="h-4 w-4 accent-primary"
                          onChange={(event) => updateComponent(component.id, (item) => item.type === "fillGaps" ? { ...item, answerEnabled: event.target.checked } : item)} />
                        Add answer section (optional)
                      </label>
                      {component.answerEnabled && <div className="mt-4 space-y-3">
                        {component.questions.map((question, questionIndex) => {
                          const preceding = totalQuestions(editor.components.slice(0, index));
                          return <label key={question.id} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                            <span className="w-8 shrink-0">{preceding + questionIndex + 1}.</span>
                            <input className={fieldClass} value={question.answer} placeholder="Exact answer (case-sensitive)"
                              onChange={(event) => updateComponent(component.id, (item) => item.type === "fillGaps" ? { ...item, questions: item.questions.map((q) => q.id === question.id ? { ...q, answer: event.target.value } : q) } : item)} />
                          </label>;
                        })}
                        {!component.questions.length && <p className="text-sm text-slate-400">Add questions above to enter their answers.</p>}
                      </div>}
                    </div>
                  </div>
                ) : component.type === "mcq" ? (
                  <div className="space-y-5">
                    <label className="block space-y-2">
                      <span className="text-xs font-bold uppercase text-slate-500">Heading / instructions (Markdown)</span>
                      <textarea className={`${fieldClass} min-h-28 font-mono`} value={component.heading}
                        onChange={(event) => updateComponent(component.id, (item) => item.type === "mcq" ? { ...item, heading: event.target.value } : item)}
                        placeholder="Describe what students need to do." />
                    </label>
                    {component.heading && <div className="rounded-xl border border-slate-200 bg-white p-5"><ReadingMarkdown content={component.heading} /></div>}
                    <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Questions</p>
                      {component.questions.map((question) => {
                        const number = ++questionNumber;
                        return (
                          <div key={question.id} className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
                            <div className="flex items-start gap-3">
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{number}</span>
                              <textarea className={`${fieldClass} min-h-20 flex-1`} value={question.text}
                                onChange={(event) => updateComponent(component.id, (item) => item.type === "mcq" ? { ...item, questions: item.questions.map((q) => q.id === question.id ? { ...q, text: event.target.value } : q) } : item)}
                                placeholder="Enter the question." />
                            </div>
                            <div className="ml-0 mt-4 space-y-3 md:ml-13">
                              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Options</p>
                              {question.options.map((option, optionIndex) => (
                                <div key={option.id} className="flex items-center gap-3">
                                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600">{letterLabel(optionIndex)}</span>
                                  <input className={fieldClass} value={option.text} placeholder={`Option ${optionIndex + 1}`}
                                    onChange={(event) => updateComponent(component.id, (item) => item.type === "mcq" ? { ...item, questions: item.questions.map((q) => q.id === question.id ? { ...q, options: q.options.map((candidate) => candidate.id === option.id ? { ...candidate, text: event.target.value } : candidate) } : q) } : item)} />
                                  <button type="button" className={lightButton} aria-label={`Delete option ${optionIndex + 1}`}
                                    onClick={() => updateComponent(component.id, (item) => item.type === "mcq" ? {
                                      ...item,
                                      questions: item.questions.map((q) => q.id === question.id ? {
                                        ...q,
                                        options: q.options.filter((candidate) => candidate.id !== option.id),
                                        correctOptionId: q.correctOptionId === option.id ? "" : q.correctOptionId,
                                      } : q),
                                    } : item)}>
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" className={lightButton}
                                onClick={() => updateComponent(component.id, (item) => item.type === "mcq" ? { ...item, questions: item.questions.map((q) => q.id === question.id ? { ...q, options: [...q.options, { id: crypto.randomUUID(), text: "" }] } : q) } : item)}>
                                <Plus className="h-4 w-4" /> Add option
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <button type="button" className={lightButton} onClick={() => updateComponent(component.id, (item) => item.type === "mcq" ? { ...item, questions: [...item.questions, { id: crypto.randomUUID(), text: "", options: [], correctOptionId: "" }] } : item)}>
                        <Plus className="h-4 w-4" /> Add question
                      </button>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <label className="flex cursor-pointer items-center gap-3 text-sm font-black text-slate-800">
                        <input type="checkbox" checked={component.answerEnabled} className="h-4 w-4 accent-primary"
                          onChange={(event) => updateComponent(component.id, (item) => item.type === "mcq" ? { ...item, answerEnabled: event.target.checked } : item)} />
                        Add answer section (optional)
                      </label>
                      {component.answerEnabled && <div className="mt-5 space-y-5">
                        {component.questions.map((question, questionIndex) => (
                          <fieldset key={question.id} className="space-y-2">
                            <legend className="text-sm font-black text-slate-700">Question {totalQuestions(editor.components.slice(0, index)) + questionIndex + 1}</legend>
                            {question.options.map((option, optionIndex) => (
                              <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700">
                                <input type="radio" name={`answer-${component.id}-${question.id}`} value={option.id}
                                  checked={question.correctOptionId === option.id} className="h-4 w-4 accent-primary"
                                  onChange={() => updateComponent(component.id, (item) => item.type === "mcq" ? { ...item, questions: item.questions.map((q) => q.id === question.id ? { ...q, correctOptionId: option.id } : q) } : item)} />
                                <span className="font-black">{letterLabel(optionIndex)}.</span>
                                <span>{option.text || `Option ${optionIndex + 1}`}</span>
                              </label>
                            ))}
                            {!question.options.length && <p className="text-sm text-slate-400">Add options above to select the correct answer.</p>}
                          </fieldset>
                        ))}
                        {!component.questions.length && <p className="text-sm text-slate-400">Add questions above to select their answers.</p>}
                      </div>}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <label className="block space-y-2">
                      <span className="text-xs font-bold uppercase text-slate-500">Heading / instructions (Markdown)</span>
                      <textarea className={`${fieldClass} min-h-28 font-mono`} value={component.heading}
                        onChange={(event) => updateComponent(component.id, (item) => item.type === "completeSentence" ? { ...item, heading: event.target.value } : item)}
                        placeholder="Describe how students should complete the sentences." />
                    </label>
                    {component.heading && <div className="rounded-xl border border-slate-200 bg-white p-5"><ReadingMarkdown content={component.heading} /></div>}

                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Questions</p>
                      {component.questions.map((question) => {
                        const number = ++questionNumber;
                        return (
                          <div key={question.id} className="flex items-start gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{number}</span>
                            <textarea className={`${fieldClass} min-h-20 flex-1`} value={question.text}
                              onChange={(event) => updateComponent(component.id, (item) => item.type === "completeSentence" ? { ...item, questions: item.questions.map((q) => q.id === question.id ? { ...q, text: event.target.value } : q) } : item)}
                              placeholder="Enter the first part of the sentence." />
                          </div>
                        );
                      })}
                      <button type="button" className={lightButton}
                        onClick={() => updateComponent(component.id, (item) => item.type === "completeSentence" ? { ...item, questions: [...item.questions, { id: crypto.randomUUID(), text: "", correctEndingId: "" }] } : item)}>
                        <Plus className="h-4 w-4" /> Add question
                      </button>
                    </div>

                    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Remaining sentences</p>
                      {component.endings.map((ending, endingIndex) => (
                        <div key={ending.id} className="flex items-start gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-700">{letterLabel(endingIndex)}</span>
                          <div className="min-w-0 flex-1 space-y-3">
                            <textarea className={`${fieldClass} min-h-20 font-mono`} value={ending.text}
                              onChange={(event) => updateComponent(component.id, (item) => item.type === "completeSentence" ? { ...item, endings: item.endings.map((candidate) => candidate.id === ending.id ? { ...candidate, text: event.target.value } : candidate) } : item)}
                              placeholder="Enter the remaining sentence in Markdown." />
                            {ending.text && <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><ReadingMarkdown content={ending.text} /></div>}
                          </div>
                        </div>
                      ))}
                      <button type="button" className={lightButton}
                        onClick={() => updateComponent(component.id, (item) => item.type === "completeSentence" ? { ...item, endings: [...item.endings, { id: crypto.randomUUID(), text: "" }] } : item)}>
                        <Plus className="h-4 w-4" /> Add remaining sentence
                      </button>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <label className="flex cursor-pointer items-center gap-3 text-sm font-black text-slate-800">
                        <input type="checkbox" checked={component.answerEnabled} className="h-4 w-4 accent-primary"
                          onChange={(event) => updateComponent(component.id, (item) => item.type === "completeSentence" ? { ...item, answerEnabled: event.target.checked } : item)} />
                        Add answer section (optional)
                      </label>
                      {component.answerEnabled && <div className="mt-4 space-y-3">
                        {component.questions.map((question, questionIndex) => (
                          <label key={question.id} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                            <span className="w-8 shrink-0">{totalQuestions(editor.components.slice(0, index)) + questionIndex + 1}.</span>
                            <select className={fieldClass} value={question.correctEndingId}
                              onChange={(event) => updateComponent(component.id, (item) => item.type === "completeSentence" ? { ...item, questions: item.questions.map((q) => q.id === question.id ? { ...q, correctEndingId: event.target.value } : q) } : item)}>
                              <option value="">Select the correct remaining sentence</option>
                              {component.endings.map((ending, endingIndex) => (
                                <option key={ending.id} value={ending.id}>{letterLabel(endingIndex)} — {ending.text || `Remaining sentence ${endingIndex + 1}`}</option>
                              ))}
                            </select>
                          </label>
                        ))}
                        {!component.questions.length && <p className="text-sm text-slate-400">Add questions above to select their answers.</p>}
                      </div>}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 rounded-2xl border border-dashed border-slate-300 p-5">
            <button type="button" className={lightButton} onClick={() => addComponent("passage")}><Plus className="h-4 w-4" /> Add passage</button>
            <button type="button" className={lightButton} onClick={() => addComponent("fillGaps")}><Plus className="h-4 w-4" /> Add fill gaps</button>
            <button type="button" className={lightButton} onClick={() => addComponent("mcq")}><Plus className="h-4 w-4" /> Add MCQ</button>
            <button type="button" className={lightButton} onClick={() => addComponent("completeSentence")}><Plus className="h-4 w-4" /> Add complete sentence</button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">{editor.components.length} parts · {totalQuestions(editor.components)} questions</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" disabled={saving} className={lightButton} onClick={() => void save(false)}><Save className="h-4 w-4" /> Save draft</button>
              <button type="button" disabled={saving} onClick={() => void save(true)} className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white disabled:opacity-50">
                {saving ? "Saving..." : editor.isPublished ? "Save and keep published" : "Publish set"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div><h2 className="text-xl font-black text-slate-900">Reading sets</h2><p className="text-sm text-slate-500">Build passages and question components in the order students will see them.</p></div>
            <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white"><Plus className="h-4 w-4" /> Add a set</button>
          </div>
          {loading ? <p className="py-10 text-center text-sm text-slate-400">Loading reading sets...</p>
            : loadError ? <p className="py-10 text-center text-sm text-red-600">{loadError}</p>
              : sets.length ? <div className="divide-y divide-slate-100 border-y border-slate-100">
                {sets.map((set) => <div key={set.id} className="flex flex-wrap items-center gap-4 py-4">
                  <div className="min-w-0 flex-1"><p className="truncate font-black text-slate-900">{set.title}</p><p className="mt-1 text-xs text-slate-500">{totalQuestions(set.components)} questions · {set.isPublished ? "Published" : "Draft"}</p></div>
                  <button type="button" className={lightButton} onClick={() => openEdit(set)}><Pencil className="h-4 w-4" /> Edit</button>
                  <button type="button" className={lightButton} onClick={() => void remove(set)}><Trash2 className="h-4 w-4" /> Delete</button>
                </div>)}
              </div> : <p className="py-10 text-center text-sm text-slate-400">No reading sets yet.</p>}
        </div>
      )}
    </div>
  );
}
