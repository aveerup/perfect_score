import Image from "next/image";
import Link from "next/link";

function LogoMark({ small = false }: { small?: boolean }) {
  return (
    <Image
      src="/new_landing_page_resources/favicon_bg_remove.png"
      alt="Perfect Score"
      width={64}
      height={64}
      className={["object-contain", small ? "h-11 w-11" : "h-20 w-20"].join(" ")}
    />
  );
}

const footerSections = [
  [
    "Platform",
    [
      { label: "What you get", href: "/#what-you-get" },
      { label: "Curriculum", href: "/#curriculum" },
      { label: "Study plans", href: "/#study-plans" },
      { label: "Pricing", href: "/#pricing" },
    ],
  ],
  [
    "IELTS",
    [
      { label: "Listening", href: "/#curriculum" },
      { label: "Reading", href: "/#curriculum" },
      { label: "Writing", href: "/#curriculum" },
      { label: "Speaking", href: "/#curriculum" },
    ],
  ],
  [
    "Support",
    [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/#contact" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  ],
] as const;

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto w-full max-w-[1262px] px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link href="/" aria-label="Perfect Score home">
              <LogoMark small />
            </Link>
            <p className="mt-7 max-w-[260px] text-base font-medium leading-7 text-neutral-500">
              IELTS preparation for students who&apos;d rather practise than shop for courses.
            </p>
          </div>
          {footerSections.map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-[13px] font-black uppercase tracking-[0.24em] text-black">{heading}</h3>
              <div className="mt-5 space-y-3">
                {links.map((link) => (
                  <Link key={link.label} href={link.href} className="block text-base font-medium text-neutral-500 hover:text-black">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-neutral-200 pt-7 text-sm font-medium text-neutral-500">
          © 2026 Perfect Score. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
