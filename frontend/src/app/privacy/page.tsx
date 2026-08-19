import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, Database, Eye, Globe, Lock, Shield } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

const highlights = [
  { icon: Lock, title: "Encrypted Data", desc: "All data in transit and at rest is encrypted using industry-standard AES-256." },
  { icon: Eye, title: "No Data Selling", desc: "We will never sell, rent, or share your personal data with third-party advertisers." },
  { icon: Database, title: "Data Portability", desc: "You can request an export of all your personal data at any time from your profile settings." },
  { icon: Bell, title: "Opt-Out Anytime", desc: "All marketing communications include unsubscribe links. We respect your inbox." },
  { icon: Globe, title: "GDPR Compliant", desc: "Our practices comply with the General Data Protection Regulation for EU residents." },
  { icon: Shield, title: "Right to Deletion", desc: "Request permanent account deletion and data erasure at any time." },
];

const sections = [
  {
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us when you create an account, including your name, email address, and optionally your phone number and location. We also collect usage data, such as which lessons you complete, your practice scores, time spent on each module, and device/browser information, to power our adaptive learning engine and improve the platform.",
  },
  {
    title: "2. How We Use Your Information",
    content: "We use collected data to: (a) provide, personalise, and improve the Perfect Score platform; (b) generate your adaptive study plan and band score predictions; (c) send service-related communications, including account confirmations and study reminders; (d) respond to your support requests; (e) detect and prevent fraud or abuse; and (f) conduct anonymised research to improve our AI and content.",
  },
  {
    title: "3. Data Sharing",
    content: "We do not sell your personal data. We may share data with: (a) service providers who assist in operating the platform, including cloud hosting, payment processing, and email delivery, under strict data processing agreements; (b) law enforcement when required by applicable law or to protect the rights and safety of our users; (c) a successor entity in the event of a merger or acquisition, with advance notice to you.",
  },
  {
    title: "4. Cookies and Tracking",
    content: "We use essential cookies to keep you logged in and remember your preferences. We use analytic cookies, via privacy-first tools, to understand how the platform is used in aggregate. You can control cookie preferences in your browser settings. Disabling essential cookies may affect platform functionality.",
  },
  {
    title: "5. Data Retention",
    content: "We retain your personal data for as long as your account is active, or as long as necessary to provide the service. If you delete your account, we will delete or anonymise your personal data within 30 days, except where we are required by law to retain it longer, such as financial transaction records for 7 years.",
  },
  {
    title: "6. Security",
    content: "We implement appropriate technical and organisational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, disclosure, or access. This includes TLS encryption, access controls, regular security audits, and employee training. No system is 100% secure; we encourage you to use a strong, unique password.",
  },
  {
    title: "7. Your Rights",
    content: "You have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data; object to or restrict certain data processing; and data portability. To exercise these rights, email privacy@perfectscore.app. We will respond within 30 days.",
  },
  {
    title: "8. Children's Privacy",
    content: "Perfect Score is not intended for children under 13. We do not knowingly collect personal data from children under 13. If we become aware that we have collected such data, we will delete it promptly. If you believe a child under 13 has provided us with personal information, please contact us.",
  },
  {
    title: "9. Changes to this Policy",
    content: "We may update this Privacy Policy periodically. We will notify you of material changes via email or an in-app notice at least 14 days before they take effect. Your continued use of the platform after that date constitutes acceptance of the updated policy.",
  },
  {
    title: "10. Contact Us",
    content: "For privacy-related questions, requests, or complaints, contact our Data Protection Officer at: privacy@perfectscore.app. Response time: within 5 business days. Mailing address: Perfect Score Ltd., House 42, Road 11, Banani, Dhaka 1213, Bangladesh.",
  },
];

function LogoMark() {
  return (
    <Image
      src="/new_landing_page_resources/favicon_bg_remove.png"
      alt="Perfect Score"
      width={64}
      height={64}
      priority
      className="h-20 w-20 object-contain"
    />
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-[102px] w-full max-w-[1262px] items-center justify-between px-5 md:px-8">
          <Link href="/" aria-label="Perfect Score home">
            <LogoMark />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <section className="border-b border-neutral-200">
        <div className="mx-auto w-full max-w-[1262px] px-5 py-20 md:px-8 md:py-24">
          <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.36em] text-neutral-500">Legal</p>
          <h1 className="max-w-[760px] text-5xl font-black leading-tight text-black md:text-[72px]">Privacy Policy</h1>
          <p className="mt-6 text-base font-medium text-neutral-500">Last updated: 1 May 2025 · Your data, your rights.</p>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto w-full max-w-[1262px] px-5 py-16 md:px-8">
          <div className="grid border border-neutral-200 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <article key={highlight.title} className="min-h-[178px] border-b border-neutral-200 p-7 md:border-r md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
                  <Icon className="h-6 w-6 stroke-[1.8] text-black" />
                  <h2 className="mt-7 text-lg font-black text-black">{highlight.title}</h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-neutral-500">{highlight.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200">
        <div className="mx-auto w-full max-w-[970px] px-5 py-16 md:px-8 md:py-24">
          <div className="border-t border-neutral-200">
            {sections.map((section) => (
              <article key={section.title} className="border-b border-neutral-200 py-8">
                <h2 className="text-xl font-black text-black">{section.title}</h2>
                <p className="mt-4 text-base font-medium leading-8 text-neutral-600">{section.content}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
