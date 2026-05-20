import { ArrowDown } from "lucide-react";
import chrisImg from "@assets/chris_2025_profilepic_1779222064968.jpg";
import octoImg from "@assets/crrypto_octopus_profile_pic_1779222086456.jpg";
import lennyImg from "@assets/Lenny_profile_pic2025_1779222101316.jpg";
import sphereImg from "@assets/sphere_profile_pic_(2)_1779222134900.jpg";

const FLOATING_CARDS = [
  { image: sphereImg, name: "Crypto Sphere", subs: "191K subs", price: "$400", color: "#9333ea", rotate: "-6deg", top: "8%",  right: "2%",  scale: 1,    id: "cryptosphere"  },
  { image: lennyImg,  name: "Lenny Crypto",  subs: "161K subs", price: "$400", color: "#a855f7", rotate: "5deg",  top: "35%", right: "18%", scale: 0.88, id: "lennycrypto"   },
  { image: chrisImg,  name: "Crypto Christopher", subs: "137K subs", price: "$350", color: "#ef4444", rotate: "-3deg", top: "60%", right: "4%",  scale: 0.95, id: "cryptochristo" },
  { image: octoImg,   name: "Crypto Octo",   subs: "86K subs",  price: "$250", color: "#6366f1", rotate: "7deg",  top: "20%", right: "36%", scale: 0.78, id: "cryptoocto"    },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-blob" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-16 md:pt-16 md:pb-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1
            className="font-black tracking-tighter leading-[0.92] max-w-5xl"
            style={{ fontSize: "clamp(42px, 6vw, 90px)" }}
          >
            <span className="block text-foreground">YOUR AD IN FRONT OF</span>
            <span className="block italic font-black text-destructive mt-1 red-glow">
              900K+ CRYPTO INVESTORS.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg leading-relaxed">
            Pick your channels, stack the bundle discount, send one message. That's the whole process.
          </p>

          <div className="mt-8 flex items-stretch gap-8 md:gap-12">
            <Stat value="7" label="Active Channels" />
            <Divider />
            <Stat value="900K+" label="Subscribers" />
            <Divider />
            <Stat value="100+" label="Campaigns Run" />
          </div>

          <a
            href="#channels"
            className="mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowDown className="h-3.5 w-3.5 scroll-arrow" />
            Browse channels
          </a>
        </div>

        {/* Interactive channel cards */}
        <div className="relative hidden md:block h-[420px]" aria-hidden>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,1) 100%)",
              maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,1) 100%)",
            }}
          />

          {FLOATING_CARDS.map((card) => (
            <a
              key={card.name}
              href="#channels"
              className="absolute rounded-xl border border-white/10 bg-[#0f1319] px-5 py-4 hover:border-white/25 hover:scale-105 transition-all duration-200 group cursor-pointer"
              style={{
                top: card.top,
                right: card.right,
                transform: `rotate(${card.rotate}) scale(${card.scale})`,
                width: 250,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              aria-label={`View ${card.name}`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                  style={{ border: `2px solid ${card.color}55` }}
                />
                <div className="min-w-0">
                  <div className="text-base font-bold text-white truncate">{card.name}</div>
                  <div className="text-sm text-white/50">{card.subs}</div>
                </div>
              </div>
              <div
                className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-black"
                style={{ backgroundColor: card.color + "33", color: card.color, border: `1px solid ${card.color}55` }}
              >
                {card.price}/video
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
        {value}
      </span>
      <span className="mt-1 text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="w-px self-stretch bg-[#2a2f45]" />;
}
