import { Send } from "lucide-react";
import logoImg from "@assets/cryptoclicks-low-resolution-logo-white-on-transparent-backgrou_1779222416737.png";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--footer-bg)" }}>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-8">
        <p className="italic text-sm text-muted-foreground mb-6" style={{ letterSpacing: "0.01em" }}>
          Built for crypto projects that want real reach.
        </p>
        <div className="flex items-center justify-between text-sm">
          <img src={logoImg} alt="CryptoClicks" className="h-6 w-auto" />
          <span className="text-muted-foreground hidden md:block">
            © 2026 CryptoClicks. All rights reserved.
          </span>
          <a
            href="https://t.me/crypoclicksio"
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:border-primary hover:text-primary transition-all"
            style={{ opacity: 0.6 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            aria-label="Telegram"
          >
            <Send className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
