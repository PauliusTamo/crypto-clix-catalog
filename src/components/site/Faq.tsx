import { useState } from "react";
import { Plus, X } from "lucide-react";

const FAQS = [
  { q: "How does the ordering process work?", a: "Pick the channels and exact service you need, then head to checkout — you'll get a message you can copy and send straight to our email or Telegram. From there we'll get back to you within a few hours to finalize the payment." },
  { q: "What is included in a dedicated video?", a: "A dedicated video is a full sponsorship where the entire video is built around your brand or product. This includes a scripted walkthrough, on-screen demonstration, a call-to-action, and a pinned link in the description. You'll receive a preview before it goes live and a performance report afterward." },
  { q: "How long until my campaign goes live?", a: "Your campaign goes live within 72 hours — guaranteed. If we miss that window, you get an extra video on us." },
  { q: "Can I pick channels I like the most?", a: "Yes — since we work within the same niche, all our channels are already relevant to your audience. You're free to browse and handpick exactly which channels you want your campaign to run on." },
  { q: "Do you offer guarantees or performance metrics?", a: "We provide post-campaign reports with views, click-through rates, and engagement data. While we don't guarantee specific view counts, we only place campaigns on channels with verified audience metrics and consistent performance history. Your account manager can share benchmark data before you commit." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-6 pt-14 pb-28">
      <div className="label-eyebrow mb-3">FAQ</div>
      <h2
        className="font-black tracking-tighter text-4xl md:text-5xl mb-12 leading-[0.95]"
        style={{ maxWidth: 600 }}
      >
        Everything you need
        <br />
        to know.
      </h2>
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`rounded-xl border border-border overflow-hidden transition-colors ${
                isOpen ? "bg-[#131a2e]" : "bg-card"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold">{f.q}</span>
                {isOpen ? (
                  <X className="h-4 w-4 text-primary shrink-0 transition-transform" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground shrink-0 transition-transform" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Still have questions?{" "}
        <a
          href="https://t.me/cryptoclicksio"
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:text-primary-glow transition-colors font-semibold"
        >
          → Message us on Telegram
        </a>
      </p>
    </section>
  );
}
