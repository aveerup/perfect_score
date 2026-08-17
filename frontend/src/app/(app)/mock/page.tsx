import { ArrowUpRight } from "lucide-react";

const STUDENT_PORTAL_URL = "https://perfectscore.ieltstest.center/smart-login/";

export default function MockExamPage() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center pb-12">
      <a
        href={STUDENT_PORTAL_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:shadow-xl hover:shadow-primary/40"
      >
        Student Portal
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}
