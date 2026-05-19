import { Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between text-sm">
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
    </footer>
  );
}
