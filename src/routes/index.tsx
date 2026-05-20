import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Channels } from "@/components/site/Channels";
import { UpsellBanner } from "@/components/site/UpsellBanner";
import { Bundles } from "@/components/site/Bundles";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { CheckoutFlow } from "@/components/site/CheckoutFlow";
import { Shorts } from "@/components/site/Shorts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CryptoClicks — Crypto YouTube Influencer Campaigns" },
      {
        name: "description",
        content:
          "Pick from crypto-native YouTube channels, bundle them for automatic discounts, and reach thousands of real investors with CryptoClicks.",
      },
      { property: "og:title", content: "CryptoClicks — Crypto YouTube Influencer Campaigns" },
      {
        property: "og:description",
        content: "Bundle crypto-native YouTube channels and launch campaigns that reach real investors.",
      },
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
