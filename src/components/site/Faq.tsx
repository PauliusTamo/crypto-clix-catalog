import { useState } from "react";
import { Plus, X } from "lucide-react";

const FAQS = [
  {
    q: "How does ordering work?",
    a: "Add channels and services, then open the cart. You'll get a pre-written message — copy it and send it to us on Telegram or email. You'll hear back within a few hours.",
  },
  {
    q: "What's included in a dedicated video?",
    a: "The entire video is built around your brand — scripted walkthrough, on-screen demo, CTA, and a pinned link. You get a preview before it goes live and a performance report after.",
  },
  {
    q: "How fast does my campaign go live?",
    a: "72 hours, guaranteed. Miss that window and you get a free video.",
  },
  {
    q: "Can I pick specific channels?",
    a: "Yes. All our channels are crypto-native — browse and pick exactly which ones you want. No mandatory bundles.",
  },
  {
    q: "What guarantees do you offer?",
    a: "Every campaign comes with full script approval before anything goes live, unlimited revisions until you're satisfied with the content, and a detailed performance report after the campaign wraps. If we miss an agreed deadline, you get a free video. We don't overpromise on views — we guarantee the quality of the work and full transparency throughout.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-6 pt-14 pb-28">
      <div className="label-eyebrow mb-3">FAQ</div>
      <h2
        className="font-black tracking-tighter text-4xl md:text-5xl mb-12 leading-[0.95]"
        style={{ maxWidth: 520 }}
      >
        Common questions.
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
                  <X className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
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
