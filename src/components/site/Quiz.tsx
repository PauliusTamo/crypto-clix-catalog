import { useState } from "react";
import { ArrowRight, Check, Plus, X } from "lucide-react";
import { CHANNELS, useCart } from "@/lib/cart";

type Step = 1 | 2 | 3 | "results";

const GOAL_SCORES: Record<string, Record<string, number>> = {
  awareness:   { lennycrypto: 2, cryptosphere: 2, cryptochristo: 1 },
  credibility: { freddiefinance: 2, cypherdefi: 2, cryptochristo: 2 },
  longterm:    { cryptonautic: 2, freddiefinance: 2, cypherdefi: 1 },
  listing:     { cryptosphere: 2, lennycrypto: 2, cypherdefi: 1 },
};

const AUDIENCE_SCORES: Record<string, Record<string, number>> = {
  retail:   { cryptoocto: 2, lennycrypto: 1, cryptochristo: 1 },
  defi:     { cypherdefi: 2, cryptonautic: 1, cryptosphere: 1 },
  traders:  { lennycrypto: 2, cypherdefi: 1, cryptochristo: 1 },
  general:  { freddiefinance: 2, cryptonautic: 1, cryptoocto: 1 },
};

const BUDGET_COUNT: Record<string, number> = {
  under500:    1,
  "500to1000": 2,
  "1000to2500": 2,
  "2500plus":  3,
};

function getRecommendations(budget: string, goal: string, audience: string) {
  const scores: Record<string, number> = {};
  CHANNELS.forEach((c) => (scores[c.id] = 0));

  const goalMap = GOAL_SCORES[goal] ?? {};
  const audMap = AUDIENCE_SCORES[audience] ?? {};
  Object.entries(goalMap).forEach(([id, s]) => (scores[id] = (scores[id] ?? 0) + s));
  Object.entries(audMap).forEach(([id, s]) => (scores[id] = (scores[id] ?? 0) + s));

  const count = BUDGET_COUNT[budget] ?? 2;
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([id]) => CHANNELS.find((c) => c.id === id)!)
    .filter(Boolean);
}

interface QuizProps {
  onClose: () => void;
  onBrowseAll: () => void;
}

export function Quiz({ onClose, onBrowseAll }: QuizProps) {
  const { add, cart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [budget, setBudget] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");

  const recommendations = step === "results"
    ? getRecommendations(budget, goal, audience)
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] rounded-2xl border border-border bg-[#0f1319] p-7 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition"
        >
          <X className="h-4 w-4" />
        </button>

        {step !== "results" && (
          <div className="mt-6 mb-5 flex items-center gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-1.5 flex-1 transition-all duration-300"
                style={{
                  borderRadius: 999,
                  backgroundColor: (step as number) >= n ? "#4a6cf7" : "#2a2f45",
                }}
              />
            ))}
          </div>
        )}

        {step === 1 && (
          <QuizStep
            label="Step 1 of 3"
            question="What's your campaign budget?"
            options={[
              { value: "under500",    label: "Under $500" },
              { value: "500to1000",   label: "$500–$1,000" },
              { value: "1000to2500",  label: "$1,000–$2,500" },
              { value: "2500plus",    label: "$2,500+" },
            ]}
            onSelect={(v) => { setBudget(v); setStep(2); }}
          />
        )}

        {step === 2 && (
          <QuizStep
            label="Step 2 of 3"
            question="What's the main goal?"
            options={[
              { value: "awareness",   label: "Token awareness / presale hype" },
              { value: "credibility", label: "Project credibility / review coverage" },
              { value: "longterm",    label: "Long-term audience building" },
              { value: "listing",     label: "Exchange listing / partnership visibility" },
            ]}
            onSelect={(v) => { setGoal(v); setStep(3); }}
          />
        )}

        {step === 3 && (
          <QuizStep
            label="Step 3 of 3"
            question="Who are you targeting?"
            options={[
              { value: "retail",   label: "Retail investors / holders" },
              { value: "defi",     label: "DeFi / on-chain natives" },
              { value: "traders",  label: "Traders / high-intent buyers" },
              { value: "general",  label: "General crypto curious" },
            ]}
            onSelect={(v) => { setAudience(v); setStep("results"); }}
          />
        )}

        {step === "results" && (
          <div>
            <div className="label-eyebrow mb-3">Your match</div>
            <h3 className="font-black text-2xl tracking-tight mb-5">Recommended channels</h3>
            <div className="space-y-3">
              {recommendations.map((ch) => {
                const inCart = (cart[ch.id] ?? 0) > 0;
                return (
                  <div
                    key={ch.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5"
                  >
                    <img
                      src={ch.image}
                      alt={ch.name}
                      className="h-10 w-10 rounded-full object-cover shrink-0"
                      style={{ border: `2px solid ${ch.color}55` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{ch.name}</div>
                      <div className="text-xs text-muted-foreground">{ch.subs} subs · {ch.engagementRate} engagement</div>
                    </div>
                    <div className="font-bold text-sm">${ch.price}/vid</div>
                    {inCart ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 shrink-0">
                        <Check className="h-3.5 w-3.5" /> Added
                      </span>
                    ) : (
                      <button
                        onClick={() => add(ch.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#2a2f45] bg-transparent px-2.5 h-7 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors shrink-0"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              These are our picks based on your answers — you can always browse all channels below.
            </p>
            <button
              onClick={() => { onBrowseAll(); onClose(); }}
              className="mt-3 text-xs text-primary underline underline-offset-2 hover:text-primary-glow transition"
            >
              Browse all channels
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuizStep({
  label,
  question,
  options,
  onSelect,
}: {
  label: string;
  question: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2 font-medium">{label}</div>
      <h3 className="font-black text-xl tracking-tight mb-5">{question}</h3>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex items-center justify-between rounded-xl border border-[#1e2535] bg-[#131720] hover:bg-[#1a2035] hover:border-[#4a6cf7] px-4 h-12 text-sm font-semibold text-foreground transition-all duration-150 text-left group"
          >
            {opt.label}
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-150 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuizEntryLink({ onClick }: { onClick: () => void }) {
  return (
    <p className="text-sm text-muted-foreground">
      Not sure where to start?{" "}
      <button
        onClick={onClick}
        className="text-primary underline underline-offset-2 hover:text-primary-glow transition font-medium"
      >
        → Find your best channels
      </button>
    </p>
  );
}
