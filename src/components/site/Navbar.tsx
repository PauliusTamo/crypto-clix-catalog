import { Send } from "lucide-react";
import logoImg from "@assets/cryptoclicks-low-resolution-logo-white-on-transparent-backgrou_1779222416737.png";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14] border-b border-white/5" style={{ transform: "translateZ(0)" }}>
      <div className="mx-auto max-w-7xl px-6 h-12 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <img src={logoImg} alt="CryptoClicks" className="h-7 w-auto" />
        </a>
        <a
          href="https://t.me/crypoclicksio"
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
