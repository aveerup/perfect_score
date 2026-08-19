"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AuthJoinPanel, type AuthMode } from "@/components/auth/AuthJoinPanel";
import { Footer as SiteFooter } from "@/components/layout/Footer";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Check,
  ChevronDown,
  Keyboard,
  ListChecks,
  Mail,
  PlayCircle,
  Phone,
  Timer,
} from "lucide-react";

const assets = {
  logo: "/new_landing_page_resources/favicon_bg_remove.png",
  reading: "/new_landing_page_resources/exam.jpg",
  listening: "/new_landing_page_resources/mock-test.jpg",
  notes: "/new_landing_page_resources/study.jpg",
  writing: "/new_landing_page_resources/teacher.jpg",
  speaking: "/new_landing_page_resources/speaking.jpg",
};

const navItems = [
  { label: "What you get", href: "#what-you-get" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Study plans", href: "#study-plans" },
  { label: "Results", href: "#results" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const features = [
  {
    icon: PlayCircle,
    title: "Video Lectures",
    text: "Concept-first lessons that explain the why, not just the answer key.",
  },
  {
    icon: ListChecks,
    title: "Practice Questions",
    text: "Thousands of questions sorted by topic and difficulty, with worked solutions.",
  },
  {
    icon: CalendarDays,
    title: "Study Plans",
    text: "Day-by-day plans that tell you exactly what to open next.",
  },
  {
    icon: BookOpenText,
    title: "Vocabulary",
    text: "Spaced-repetition word lists built for long-term retention.",
  },
  {
    icon: Keyboard,
    title: "Typing Practice",
    text: "Build the speed and accuracy your timed writing sections demand.",
  },
  {
    icon: Timer,
    title: "Mock Tests",
    text: "Full-length, timed simulations with section-level score analysis.",
  },
];

const skillCards = [
  {
    image: assets.reading,
    title: "Reading & Writing",
    text: "Task 1 and Task 2 frameworks, model answers and timed reading drills.",
  },
  {
    image: assets.speaking,
    title: "Listening & Speaking",
    text: "Part 1-3 cue cards, accent training and section-by-section listening sets.",
  },
  {
    image: assets.notes,
    title: "Vocabulary & Notes",
    text: "Band-9 lexical resource, collocations and spaced-repetition review.",
  },
];

const modules = [
  {
    number: "01",
    title: "Listening",
    stat: "38 lessons · 9 practice sets",
    image: assets.listening,
    bullets: [
      "Map, diagram and form-completion strategies drilled one at a time",
      "Accent training: British, Australian, Canadian and American speakers",
      "Prediction and paraphrase spotting before the audio starts",
      "Section 3 and 4 traps: distractors, corrections and spelling penalties",
    ],
  },
  {
    number: "02",
    title: "Reading",
    stat: "42 lessons · 14 timed passages",
    image: assets.reading,
    reverse: true,
    bullets: [
      "True / False / Not Given decided by rule, not by feeling",
      "Matching headings and matching information without re-reading",
      "A 20-minute-per-passage pacing system you actually stick to",
      "Vocabulary-in-context so unknown words stop costing you bands",
    ],
  },
  {
    number: "03",
    title: "Writing",
    stat: "31 lessons · 60 model answers",
    image: assets.writing,
    bullets: [
      "Task 1 templates for line graphs, bar charts, tables, maps and processes",
      "Task 2 essay skeletons for opinion, discussion, problem and two-part prompts",
      "Band 6 vs Band 8 answers compared line by line against the descriptors",
      "Typing practice built in, because computer-delivered IELTS is timed",
    ],
  },
  {
    number: "04",
    title: "Speaking",
    stat: "27 lessons · 200+ cue cards",
    image: assets.speaking,
    reverse: true,
    bullets: [
      "Part 1 answers that sound natural instead of memorised",
      "Part 2 cue-card frameworks you can fill in during the 1-minute prep",
      "Part 3 opinion structures for abstract, unfamiliar topics",
      "Fluency, pronunciation and lexical resource fixes, with recordings",
    ],
  },
];

const testimonials = [
  {
    quote:
      "I was stuck at 6.5 in Writing for two attempts. The Task 2 skeletons and the band descriptor breakdowns got me to 7.5 in six weeks.",
    name: "Nusrat A.",
    meta: "Band 8.0 overall · Dhaka",
  },
  {
    quote:
      "The daily list is the whole thing. I stopped wasting hours deciding what to study and just opened the app every morning.",
    name: "Tanvir H.",
    meta: "Band 7.5 overall · Chattogram",
  },
  {
    quote:
      "Coaching centres wanted 15,000 taka. This cost me 999 a month and the mock test analysis was far more detailed.",
    name: "Sadia R.",
    meta: "Band 8.5 overall · Sylhet",
  },
];

const comparisonRows = [
  ["Monthly cost", "999 taka", "12,000-20,000 taka"],
  ["Study on your schedule", "Yes, 24/7", "Fixed batch timings"],
  ["Full mock tests", "Unlimited", "2-3 per course"],
  ["Section-level score analysis", "Automatic", "Rarely"],
  ["Re-watch any lesson", "Unlimited", "No"],
  ["Cancel any time", "Yes", "Course fee is non-refundable"],
];

const planRows = [
  ["Mon", "Listening lecture", "Vocabulary list", "Typing 10 min"],
  ["Tue", "Reading lecture", "Timed passage x2", "Review log"],
  ["Wed", "Writing Task 1", "Model answer study", "Typing 10 min"],
  ["Thu", "Speaking Part 1-2", "Record & self-score", "Vocabulary review"],
  ["Fri", "Writing Task 2", "Band descriptor check", "Typing 10 min"],
  ["Sat", "Full mock section", "Error analysis", "-"],
  ["Sun", "Weak-area drills", "Plan next week", "Rest"],
];

const faqs = [
  {
    question: "Is 999 taka the full price?",
    answer: "Yes. It is one membership at 999 taka per month, with no separate module fee.",
  },
  {
    question: "Academic or General Training?",
    answer: "Both. Reading and Writing branch where the exam format differs, while Listening and Speaking remain shared.",
  },
  {
    question: "How long do I need before my exam?",
    answer: "Four, eight and twelve week plans are included, so you can choose based on your exam date and available hours.",
  },
  {
    question: "Are the mock tests scored?",
    answer: "Yes. Mock tests include section-level analysis so you know what to fix before the next attempt.",
  },
  {
    question: "Can I cancel?",
    answer: "Yes. You can cancel any time and keep access through the paid billing period.",
  },
  {
    question: "Does it work on my phone?",
    answer: "Yes. Lessons, vocabulary, plans and review work on mobile, tablet and desktop.",
  },
];

function LogoMark({ small = false }: { small?: boolean }) {
  return (
    <Image
      src={assets.logo}
      alt="Perfect Score"
      width={64}
      height={64}
      priority={!small}
      className={["object-contain", small ? "h-11 w-11" : "h-20 w-20"].join(" ")}
    />
  );
}

function Header({ onAuthOpen }: { onAuthOpen: (mode: AuthMode) => void }) {
  const [activeSection, setActiveSection] = useState("what-you-get");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[102px] w-full max-w-[1296px] items-center justify-between gap-5 px-5 md:px-8">
        <Link href="#what-you-get" aria-label="Perfect Score home" className="shrink-0">
          <LogoMark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Landing page sections">
          {navItems.map((item) => {
            const sectionId = item.href.slice(1);
            const active = activeSection === sectionId;

            return (
              <a
                key={item.href}
                href={item.href}
                className={[
                  "px-4 py-3 text-[15px] font-medium transition",
                  active ? "bg-black text-white" : "text-black hover:bg-neutral-100",
                ].join(" ")}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onAuthOpen("login")}
            className="bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 md:px-6 md:text-[15px]"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onAuthOpen("join")}
            className="bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 md:px-6 md:text-[15px]"
          >
            Join now
          </button>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-neutral-200 px-4 py-2 md:hidden" aria-label="Landing page sections">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="shrink-0 px-3 py-2 text-sm font-medium text-black">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-28 border-b border-neutral-200 ${className}`}>
      <div className="mx-auto w-full max-w-[1262px] px-5 md:px-8">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.36em] text-neutral-500">{children}</p>;
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li key={item} className="flex gap-4 text-[15px] font-medium leading-relaxed text-black md:text-base">
          <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.4]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StudyPlanMockup() {
  const tasks = [
    { label: "Video: Ratios & Proportions", done: true },
    { label: "Practice set - 20 questions", done: true },
    { label: "Vocabulary: list 04" },
    { label: "Typing drill - 10 min" },
    { label: "Mock test - Section 1" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[590px] border border-black bg-white p-7 shadow-[10px_10px_0_#050505] md:p-9">
      <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-5">
        <h2 className="text-base font-black uppercase tracking-[0.18em]">Study Plan</h2>
        <span className="text-[15px] text-neutral-500">Day 12 / 60</span>
      </div>
      <div className="space-y-3.5">
        {tasks.map((task) => (
          <div key={task.label} className="flex items-center gap-4">
            <span className={`grid h-6 w-6 place-items-center border border-black ${task.done ? "bg-black text-white" : "bg-white"}`}>
              {task.done ? <Check className="h-4 w-4" /> : null}
            </span>
            <span className={`text-base md:text-[17px] ${task.done ? "text-neutral-500 line-through" : "text-black"}`}>{task.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-neutral-200 pt-5">
        <div className="h-2 border border-black">
          <div className="h-full w-[40%] bg-black" />
        </div>
        <p className="mt-2 text-sm text-neutral-500">40% complete this week</p>
      </div>
    </div>
  );
}

function Hero({ onAuthOpen }: { onAuthOpen: (mode: AuthMode) => void }) {
  return (
    <Section id="what-you-get" className="bg-white">
      <div className="grid min-h-[595px] items-center gap-12 py-16 lg:grid-cols-[1.03fr_0.97fr] lg:py-20">
        <div>
          <div className="mb-7 inline-flex border border-neutral-200 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.34em]">
            999 tk / month
          </div>
          <h1 className="max-w-[760px] text-[54px] font-black leading-[1.04] tracking-normal text-black md:text-[80px]">
            Band 8+ IELTS prep, without the noise.
          </h1>
          <p className="mt-8 max-w-[585px] text-xl font-medium leading-9 text-neutral-500">
            Listening, Reading, Writing and Speaking - lectures, practice, study plans, vocabulary, typing and full mock tests in one platform.
          </p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onAuthOpen("join")}
              className="inline-flex h-[58px] items-center justify-center gap-3 bg-black px-8 text-[17px] font-bold text-white transition hover:bg-neutral-800"
            >
              Start for 999 tk <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#curriculum" className="inline-flex h-[58px] items-center justify-center border-b border-black text-[17px] font-bold text-black">
              See everything inside
            </a>
          </div>
        </div>
        <StudyPlanMockup />
      </div>
    </Section>
  );
}

function SkillsCovered() {
  return (
    <Section className="bg-white">
      <div className="py-24 lg:py-28">
        <h2 className="mb-14 text-4xl font-black leading-tight text-black md:text-[40px]">All four IELTS skills, covered</h2>
        <div className="grid border border-black md:grid-cols-3">
          {skillCards.map((card) => (
            <article key={card.title} className="border-b border-black last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <Image src={card.image} width={1280} height={960} alt="" className="h-[260px] w-full object-cover md:h-[316px]" />
              <div className="min-h-[148px] p-7">
                <h3 className="text-[22px] font-black text-black">{card.title}</h3>
                <p className="mt-3 text-base font-medium leading-7 text-neutral-500">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Membership() {
  return (
    <Section className="bg-white">
      <div className="py-24 lg:py-28">
        <h2 className="mb-14 text-4xl font-black leading-tight text-black md:text-[40px]">Everything in one membership</h2>
        <div className="grid border border-neutral-200 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="min-h-[206px] border-b border-neutral-200 p-8 md:border-r md:[&:nth-child(3n)]:border-r-0 md:[&:nth-last-child(-n+3)]:border-b-0">
                <Icon className="mb-7 h-6 w-6 stroke-[1.8]" />
                <h3 className="text-[22px] font-black text-black">{feature.title}</h3>
                <p className="mt-3 max-w-[360px] text-base font-medium leading-7 text-neutral-500">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function Curriculum() {
  return (
    <Section id="curriculum" className="bg-white">
      <div className="py-24">
        <Eyebrow>The curriculum</Eyebrow>
        <h2 className="max-w-[760px] text-4xl font-black leading-tight text-black md:text-[40px]">
          Four modules. 138 lessons. Nothing you don&apos;t need.
        </h2>
        <p className="mt-5 max-w-[680px] text-base font-medium leading-7 text-neutral-500">
          Each module is taught concept-first, then drilled with real exam-format questions and reviewed with worked solutions.
        </p>

        <div className="mt-16 border-t border-neutral-200">
          {modules.map((module) => (
            <article key={module.number} className="grid gap-10 border-b border-neutral-200 py-11 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className={module.reverse ? "lg:order-2" : ""}>
                <Image src={module.image} width={1280} height={960} alt="" className="h-[360px] w-full object-cover md:h-[412px]" />
              </div>
              <div className={module.reverse ? "lg:order-1" : ""}>
                <Eyebrow>Module {module.number}</Eyebrow>
                <h3 className="text-4xl font-black text-black">{module.title}</h3>
                <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.22em] text-neutral-500">{module.stat}</p>
                <div className="mt-8">
                  <CheckList items={module.bullets} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Results() {
  return (
    <section id="results" className="scroll-mt-28 bg-white">
      <div className="bg-black py-24 text-white">
        <div className="mx-auto w-full max-w-[1262px] px-5 md:px-8">
          <h2 className="text-4xl font-black">How Perfect Score works</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-16">
            {[
              ["01", "Pick your plan", "Tell us your exam date and we build the daily schedule."],
              ["02", "Study the list", "Open the app, do what's on today's list. Nothing else."],
              ["03", "Test and adjust", "Mock tests show the gaps; the plan rewrites itself around them."],
            ].map(([num, title, text]) => (
              <article key={num}>
                <p className="text-6xl font-black leading-none text-neutral-500">{num}</p>
                <h3 className="mt-6 text-2xl font-black">{title}</h3>
                <p className="mt-3 max-w-[320px] text-base font-medium leading-7 text-neutral-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-800 bg-black py-12 text-white">
        <div className="mx-auto grid w-full max-w-[1262px] grid-cols-2 gap-10 px-5 md:grid-cols-4 md:px-8">
          {[
            ["138", "Video lessons"],
            ["4,200+", "Practice questions"],
            ["12", "Full mock tests"],
            ["999", "Taka per month"],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="text-4xl font-black md:text-[40px]">{num}</p>
              <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.24em] text-neutral-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <Section className="bg-white">
        <div className="py-24">
          <h2 className="mb-14 text-4xl font-black text-black">Students who stopped guessing</h2>
          <div className="grid border border-neutral-200 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="border-b border-neutral-200 p-8 md:border-b-0 md:border-r md:last:border-r-0">
                <p className="min-h-[100px] text-base font-medium leading-7 text-black">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-8 border-t border-neutral-200 pt-6">
                  <p className="font-black text-black">{testimonial.name}</p>
                  <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.22em] text-neutral-500">{testimonial.meta}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-24 max-w-[970px]">
            <h2 className="mb-12 text-4xl font-black text-black">Perfect Score vs a coaching centre</h2>
            <div className="overflow-x-auto border border-black">
              <table className="w-full min-w-[760px] border-collapse text-left text-base">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="w-[38%] px-5 py-4 text-[13px] uppercase tracking-[0.16em]">&nbsp;</th>
                    <th className="px-5 py-4 text-[13px] uppercase tracking-[0.16em]">Perfect Score</th>
                    <th className="px-5 py-4 text-[13px] uppercase tracking-[0.16em]">Typical coaching</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([label, perfect, coaching]) => (
                    <tr key={label} className="border-t border-neutral-200">
                      <th className="px-5 py-4 font-semibold text-black">{label}</th>
                      <td className="px-5 py-4 font-medium text-black">{perfect}</td>
                      <td className="px-5 py-4 font-medium text-neutral-500">{coaching}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>
    </section>
  );
}

function StudyPlans() {
  return (
    <Section id="study-plans" className="bg-white">
      <div className="py-24">
        <Eyebrow>Study plans</Eyebrow>
        <h2 className="max-w-[720px] text-4xl font-black leading-tight text-black md:text-[40px]">
          Tell us your exam date. We&apos;ll tell you what to do today.
        </h2>

        <div className="mt-14 grid border border-black lg:grid-cols-3">
          {[
            ["Sprint", "3 hrs / day", "4 weeks", "Exam booked and close. You need structure, fast.", ["Daily targeted drills", "2 full mocks", "Writing task every other day"], false],
            ["Standard", "2 hrs / day", "8 weeks", "The plan most students finish and score with.", ["All four modules in full", "5 full mocks", "Weekly vocabulary reviews"], true],
            ["Foundation", "1.5 hrs / day", "12 weeks", "Starting from Band 5-6 or rebuilding basics.", ["Grammar rebuild first", "8 full mocks", "Slower, heavier repetition"], false],
          ].map(([name, hours, weeks, text, bullets, dark]) => (
            <article key={name as string} className={`${dark ? "bg-black text-white" : "bg-white text-black"} min-h-[302px] p-8`}>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black">{name as string}</h3>
                  <p className={`mt-2 text-[13px] font-medium uppercase tracking-[0.18em] ${dark ? "text-neutral-400" : "text-neutral-500"}`}>{hours as string}</p>
                </div>
                <p className={`pt-1 text-[12px] font-medium uppercase tracking-[0.18em] ${dark ? "text-neutral-400" : "text-neutral-500"}`}>{weeks as string}</p>
              </div>
              <p className={`mt-6 text-base font-medium leading-7 ${dark ? "text-neutral-300" : "text-neutral-500"}`}>{text as string}</p>
              <ul className="mt-8 space-y-3">
                {(bullets as string[]).map((item) => (
                  <li key={item} className="font-medium">- {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <h3 className="mt-20 text-2xl font-black text-black">A week inside the Standard plan</h3>
        <div className="mt-8 overflow-x-auto border border-neutral-200">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-black text-white">
              <tr>
                {["Day", "Core", "Practice", "Extra"].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-[13px] font-black uppercase tracking-[0.16em]">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planRows.map((row) => (
                <tr key={row[0]} className="border-t border-neutral-200">
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${cell}`} className={`px-5 py-4 ${index === 0 ? "font-black text-black" : "font-medium text-neutral-500"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

function Pricing({ onAuthOpen }: { onAuthOpen: (mode: AuthMode) => void }) {
  const benefits = [
    "Every video lecture, start to finish",
    "Structured study plans",
    "Typing practice drills",
    "New content added every month",
    "Full practice question bank",
    "Vocabulary trainer",
    "Unlimited mock tests",
    "Cancel any time",
  ];

  return (
    <Section id="pricing" className="bg-white">
      <div className="py-28">
        <div className="mx-auto max-w-[826px] border border-black px-8 py-12 md:px-14 md:py-14">
          <Eyebrow>One membership</Eyebrow>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="text-7xl font-black leading-none text-black">999</p>
            <p className="pb-2 text-xl font-bold text-black">taka / month</p>
          </div>
          <div className="mt-12 grid gap-x-12 gap-y-5 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-4 text-base font-medium text-black">
                <Check className="h-4 w-4 shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onAuthOpen("join")}
            className="mt-12 flex h-[58px] w-full items-center justify-center gap-4 bg-neutral-800 px-6 text-base font-semibold text-white transition hover:bg-black"
          >
            Join Perfect Score <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Section>
  );
}

function AuthSection({
  mode,
  onModeChange,
}: {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}) {
  return (
    <Section id="auth" className="bg-white">
      <div className="py-24 lg:py-28">
        <AuthJoinPanel mode={mode} onModeChange={onModeChange} showBackLink={false} />
      </div>
    </Section>
  );
}

function FAQ() {
  return (
    <Section id="faq" className="bg-white">
      <div className="mx-auto max-w-[826px] py-24">
        <h2 className="mb-14 text-4xl font-black text-black">Questions, answered</h2>
        <div>
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-neutral-200 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black text-black">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-neutral-500 transition group-open:rotate-180" />
              </summary>
              <p className="pt-4 text-base font-medium leading-7 text-neutral-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ContactSection() {
  return (
    <Section id="contact" className="bg-white">
      <div className="grid gap-12 py-24 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-28">
        <div>
          <Eyebrow>Contact & payment</Eyebrow>
          <h2 className="max-w-[620px] text-4xl font-black leading-tight text-black md:text-[40px]">
            Need help joining Perfect Score?
          </h2>
          <p className="mt-5 max-w-[560px] text-base font-medium leading-7 text-neutral-500">
            Send a message for support, account help or payment confirmation. The mobile number below is also the bKash payment number.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-neutral-200 p-7">
            <Mail className="h-6 w-6 stroke-[1.8] text-black" />
            <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.24em] text-neutral-500">Email</p>
            <p className="mt-2 break-words text-xl font-black text-black">
              miftaurr314@gmail.com
            </p>
          </div>

          <div className="border border-black bg-black p-7 text-white">
            <Phone className="h-6 w-6 stroke-[1.8]" />
            <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.24em] text-neutral-400">Mobile / bKash payment</p>
            <p className="mt-2 text-3xl font-black">01782592006</p>
            <p className="mt-4 text-sm font-medium leading-6 text-neutral-300">
              Use this number for bKash payment, then fill out the fields in the join section.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FinalCTA({ onAuthOpen }: { onAuthOpen: (mode: AuthMode) => void }) {
  return (
    <section className="bg-black py-28 text-center text-white">
      <div className="mx-auto max-w-[760px] px-5">
        <h2 className="text-4xl font-black leading-tight">Your exam date isn&apos;t moving.</h2>
        <p className="mx-auto mt-6 max-w-[610px] text-base font-medium leading-7 text-neutral-400">
          Start today, follow the list, and walk into the test centre knowing exactly what every question type wants from you.
        </p>
        <button
          type="button"
          onClick={() => onAuthOpen("join")}
          className="mt-10 inline-flex h-12 items-center justify-center gap-4 bg-white px-7 text-base font-bold text-black transition hover:bg-neutral-200"
        >
          Join for 999 tk / month <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const [authMode, setAuthMode] = useState<AuthMode>(() => {
    if (typeof window === "undefined") {
      return "login";
    }

    const params = new URLSearchParams(window.location.search);
    return params.get("auth") === "join" ? "join" : "login";
  });

  const scrollToAuth = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    window.history.replaceState(null, "", `?auth=${mode}#auth`);
    window.setTimeout(() => {
      document.getElementById("auth")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedMode = params.get("auth") === "join" ? "join" : params.get("auth") === "login" ? "login" : null;

    if (requestedMode) {
      window.setTimeout(() => {
        document.getElementById("auth")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <Header onAuthOpen={scrollToAuth} />
      <Hero onAuthOpen={scrollToAuth} />
      <SkillsCovered />
      <Membership />
      <Curriculum />
      <StudyPlans />
      <Results />
      <Pricing onAuthOpen={scrollToAuth} />
      <AuthSection mode={authMode} onModeChange={setAuthMode} />
      <FAQ />
      <ContactSection />
      <FinalCTA onAuthOpen={scrollToAuth} />
      <SiteFooter />
    </main>
  );
}
