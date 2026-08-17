"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Play } from "lucide-react";
import { api, useApiData } from "@/lib/api";
import { VideoLecture } from "@/lib/types";

const VIMEO_PLAYER_OPTIONS: Record<string, string> = {
  title: "0",
  byline: "0",
  portrait: "0",
  badge: "0",
  like: "0",
  watch_later: "0",
  share: "0",
  vimeo_logo: "0",
  dnt: "1",
};

function buildVimeoEmbedUrl(lecture: VideoLecture) {
  const embedUrl = lecture.embedUrl || (lecture.vimeoId ? `https://player.vimeo.com/video/${lecture.vimeoId}` : "");
  if (!embedUrl) return "";

  try {
    const url = new URL(embedUrl);
    Object.entries(VIMEO_PLAYER_OPTIONS).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    const params = new URLSearchParams(VIMEO_PLAYER_OPTIONS);
    return `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}${params.toString()}`;
  }
}

export default function VideoPlayerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: lecture, setData, loading, error } = useApiData<VideoLecture | null>(
    `/lectures/${params.id}`,
    null,
  );

  const markComplete = async () => {
    if (!lecture) return;
    await api.post(`/lectures/${lecture.id}/progress`, {
      progress: 100,
      lastPositionSeconds: 0,
      watched: true,
    });
    setData({ ...lecture, progress: 100, watched: true });
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading lecture...</div>;
  if (error || !lecture) return <div className="py-20 text-center text-red-500">{error || "Lecture not found"}</div>;
  const vimeoEmbedUrl = buildVimeoEmbedUrl(lecture);

  return (
    <div className="space-y-8 pb-12">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
        <ArrowLeft className="w-4 h-4" /> Back to lectures
      </button>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-7">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden">
            {vimeoEmbedUrl ? (
              <iframe
                src={vimeoEmbedUrl}
                title={lecture.title}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-slate-400">
                Video embed is not available for this lecture.
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <div className="flex gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>{lecture.skill}</span>
                <span>{lecture.duration}</span>
                <span>Band {lecture.bandRange}</span>
              </div>
              <h1 className="text-3xl font-black mt-3">{lecture.title}</h1>
              <p className="text-slate-500 mt-3">{lecture.description || "IELTS lecture from your Vimeo library."}</p>
            </div>
            <button
              onClick={() => void markComplete()}
              disabled={lecture.watched}
              className="shrink-0 px-5 py-3 bg-primary text-white rounded-xl font-bold disabled:bg-green-600 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {lecture.watched ? "Completed" : "Mark complete"}
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Up next</h2>
          {(lecture.upNext ?? []).map((next) => (
            <Link key={next.id} href={`/lectures/${next.id}`} className="block group">
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
                <Play className="text-white w-6 h-6 fill-current" />
              </div>
              <p className="font-bold mt-2 group-hover:text-primary">{next.title}</p>
              <p className="text-xs text-slate-400">{next.skill} · {next.duration}</p>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}
