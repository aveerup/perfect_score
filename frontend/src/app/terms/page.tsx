import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using Perfect Score (perfectscore.app), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. These terms apply to all users, including visitors, registered learners, and premium subscribers.",
  },
  {
    title: "2. Use of Service",
    content: "Perfect Score grants you a limited, non-exclusive, non-transferable licence to access and use the platform for personal, non-commercial IELTS preparation purposes. You agree not to: (a) reproduce, duplicate, copy, sell, or exploit any portion of the service without express written permission; (b) use the platform for any unlawful purpose; (c) share your account credentials with others; (d) attempt to gain unauthorised access to any part of the service or its related systems.",
  },
  {
    title: "3. Account Responsibility",
    content: "You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account. You must notify us immediately at support@perfectscore.app of any unauthorised use or security breach. Perfect Score will not be liable for any loss or damage arising from your failure to comply with this obligation.",
  },
  {
    title: "4. Subscription and Payments",
    content: "Certain features of Perfect Score require a paid subscription. All payments are processed securely through our payment partners. Subscriptions are billed on a monthly or annual basis as selected at checkout. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period. Perfect Score does not offer refunds for partial billing periods, except where required by applicable law.",
  },
  {
    title: "5. Intellectual Property",
    content: "All content on Perfect Score, including but not limited to course materials, videos, practice questions, audio recordings, written content, and software, is the exclusive property of Perfect Score Ltd. and is protected by applicable copyright, trademark, and intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without explicit written permission.",
  },
  {
    title: "6. User-Generated Content",
    content: "When you submit content to Perfect Score, such as writing submissions or speaking recordings for AI evaluation, you grant us a limited, non-exclusive licence to process and store that content for the purpose of delivering the service to you. We do not claim ownership of your submissions. Your submissions may be anonymised and used in aggregate to improve our AI systems.",
  },
  {
    title: "7. Disclaimer of Warranties",
    content: "Perfect Score is provided on an as-is and as-available basis without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, error-free, or free of viruses. We do not guarantee any specific IELTS band score outcome as a result of using our platform. Individual results vary based on effort, prior ability, and exam conditions.",
  },
  {
    title: "8. Limitation of Liability",
    content: "To the fullest extent permitted by applicable law, Perfect Score Ltd. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of the platform, even if we have been advised of the possibility of such damages.",
  },
  {
    title: "9. Termination",
    content: "We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we determine violates these Terms, is harmful to other users, us, third parties, or for any other reason. Upon termination, your right to use the service will immediately cease.",
  },
  {
    title: "10. Governing Law",
    content: "These Terms shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh, without regard to conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Dhaka, Bangladesh.",
  },
  {
    title: "11. Changes to Terms",
    content: "We reserve the right to modify these terms at any time. We will provide at least 14 days' notice of material changes via email or an in-app notification. Your continued use of the platform after any changes constitutes your acceptance of the new terms. If you do not agree to the modified terms, you must discontinue your use of the platform.",
  },
  {
    title: "12. Contact",
    content: "If you have questions about these Terms of Service, please contact us at: legal@perfectscore.app or write to Perfect Score Ltd., House 42, Road 11, Banani, Dhaka 1213, Bangladesh.",
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

export default function TermsPage() {
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
          <h1 className="max-w-[760px] text-5xl font-black leading-tight text-black md:text-[72px]">Terms of Service</h1>
          <p className="mt-6 text-base font-medium text-neutral-500">Last updated: 1 May 2025 · Effective immediately upon account creation.</p>
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
