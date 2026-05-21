import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import logoImg from "@assets/cryptoclicks-low-resolution-logo-white-on-transparent-backgrou_1779222416737.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        background: scrolled ? "rgba(10,13,20,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        transform: "translateZ(0)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <img src={logoImg} alt="CryptoClicks" className="h-9 w-auto" />
        </a>
        <a
          href="https://t.me/cryptoclicksio"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-glow transition-colors px-3.5 h-9 text-sm font-semibold text-primary-foreground"
        >
          <Send className="h-3.5 w-3.5" />
          Telegram
        </a>
      </div>
    </header>
  );
}
