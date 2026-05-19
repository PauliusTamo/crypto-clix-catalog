import { Send } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-black text-sm">
            C
          </span>
          <span className="font-black text-lg tracking-tight">
            Crypto<span className="text-primary">Clix</span>
          </span>
        </a>
        <a
          href="https://t.me/YOUR_HANDLE"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-glow transition-colors px-4 h-10 text-sm font-semibold text-primary-foreground"
        >
          <Send className="h-4 w-4" />
          Telegram
        </a>
      </div>
    </header>
  );
}
