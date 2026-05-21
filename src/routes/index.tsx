import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { CaseTicker } from "@/components/site/CaseTicker";
import { Channels } from "@/components/site/Channels";
import { UpsellBanner } from "@/components/site/UpsellBanner";
import { Bundles } from "@/components/site/Bundles";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { CheckoutFlow } from "@/components/site/CheckoutFlow";
import { Shorts } from "@/components/site/Shorts";

const OG_TITLE = "CryptoClicks — Build Your Crypto Campaign";
const OG_DESC = "Pick your YouTube channels, stack your bundle discount, and reach 900K+ crypto investors. Browse the catalogue and launch today.";
const OG_IMAGE = "https://media.cryptoclicks.io/og-image.png";
const OG_URL = "https://media.cryptoclicks.io";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: OG_TITLE },
      { name: "description", content: OG_DESC },
      { property: "og:type",        content: "website" },
      { property: "og:url",         content: OG_URL },
      { property: "og:title",       content: OG_TITLE },
      { property: "og:description", content: OG_DESC },
      { property: "og:image",       content: OG_IMAGE },
      { name: "twitter:card",        content: "summary_large_image" },
      { name: "twitter:title",       content: OG_TITLE },
      { name: "twitter:description", content: OG_DESC },
      { name: "twitter:image",       content: OG_IMAGE },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <CaseTicker />
          <div id="channels" />
          <Channels />
          <Bundles />
          <Shorts />
          <Faq />
        </main>
        <Footer />
        <CheckoutFlow />
        <UpsellBanner />
      </div>
    </CartProvider>
  );
}
