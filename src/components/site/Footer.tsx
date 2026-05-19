import { Send } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--footer-bg)" }}>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="italic text-xs text-muted-foreground mb-3">
          Built for crypto projects that want real reach.
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-black tracking-tight">
            Crypto<span className="text-primary">Clix</span>
          </span>
          <span className="text-muted-foreground hidden md:block">
            © 2025 CryptoClix. All rights reserved.
          </span>
          <a
            href="https://t.me/YOUR_HANDLE"
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
            aria-label="Telegram"
          >
            <Send className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
