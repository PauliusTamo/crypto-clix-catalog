import { Send } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80">
      <div className="mx-auto max-w-7xl px-6 h-12 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-black text-sm">
            C
          </span>
          <span className="font-black text-base tracking-tight">
            Crypto<span className="text-primary">Clicks</span>
          </span>
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
