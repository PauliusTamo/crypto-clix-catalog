import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

import chrisImg from "@assets/chris_2025_profilepic_1779222064968.jpg";
import octoImg from "@assets/crrypto_octopus_profile_pic_1779222086456.jpg";
import lennyImg from "@assets/Lenny_profile_pic2025_1779222101316.jpg";
import sphereImg from "@assets/sphere_profile_pic_(2)_1779222134900.jpg";
import freddieImg from "@assets/image_2024-01-28_15-57-40_1779222295813.png";
import nauticImg from "@assets/image_2024-02-02_11-33-43_1779222301955.png";
import cypherImg from "@assets/image_2023-11-11_16-11-13_(2)_1779222332895.png";

export type Channel = {
  id: string;
  name: string;
  subs: string;
  subsNum: number;
  price: number;
  color: string;
  link: string;
  contentType: string;
  image: string;
  avgViews: string;
  engagementRate: string;
  audienceDesc: string;
  badge?: string;
};

export const CHANNELS: Channel[] = [
  { id: "cryptoocto",    name: "Crypto Octo",       subs: "86K",  subsNum: 86000,  price: 250, color: "#6366f1", link: "https://www.youtube.com/@CryptoOcto",         contentType: "Market Analysis", image: octoImg,   avgViews: "~8K",  engagementRate: "9.5%", audienceDesc: "UK-heavy audience, altcoin focus and mid-cap conviction" },
  { id: "cryptonautic",  name: "Crypto Nautic",      subs: "100K", subsNum: 100000, price: 300, color: "#0ea5e9", link: "https://www.youtube.com/@CryptoNautic",        contentType: "News & Trends",   image: nauticImg, avgViews: "~10K", engagementRate: "9.2%", audienceDesc: "US retail investors, macro analysis and spot traders" },
  { id: "freddiefinance",name: "Freddie Finance",    subs: "112K", subsNum: 112000, price: 300, color: "#7c3aed", link: "https://www.youtube.com/@FreddieInFinance",    contentType: "Web3 Education",  image: freddieImg,avgViews: "~12K", engagementRate: "11.3%",audienceDesc: "Asian market audience, strong DeFi and token interest", badge: "High Engagement" },
  { id: "cypherdefi",    name: "Cypher DeFi",        subs: "114K", subsNum: 114000, price: 350, color: "#2563eb", link: "https://www.youtube.com/@cypherdefi",          contentType: "DeFi Coverage",   image: cypherImg, avgViews: "~14K", engagementRate: "10.1%",audienceDesc: "European on-chain natives, heavy protocol and DeFi buyers" },
  { id: "cryptochristo", name: "Crypto Christopher", subs: "137K", subsNum: 137000, price: 350, color: "#ef4444", link: "https://www.youtube.com/@ChristopherinCrypto", contentType: "Project Reviews", image: chrisImg,  avgViews: "~11K", engagementRate: "9.8%", audienceDesc: "European mid/large-cap holders, project-review driven" },
  { id: "lennycrypto",   name: "Lenny Crypto",       subs: "161K", subsNum: 161000, price: 400, color: "#a855f7", link: "https://www.youtube.com/@LennyCrypto",         contentType: "Trading Signals", image: lennyImg,  avgViews: "~15K", engagementRate: "10.7%",audienceDesc: "US high-intent traders, strong repeat buyer behaviour", badge: "Most Picked" },
  { id: "cryptosphere",  name: "Crypto Sphere",      subs: "191K", subsNum: 191000, price: 400, color: "#9333ea", link: "https://www.youtube.com/@CryptoSphereDaily",   contentType: "Token Tracking",  image: sphereImg, avgViews: "~13K", engagementRate: "10.2%",audienceDesc: "Middle East and LATAM buyers, high purchase intent" },
];

export const BUNDLE_PRICES: Record<number, number> = { 3: 900, 5: 1400, 7: 1850 };
export const SHORTS_PRICES: Record<number, number> = { 1: 200, 5: 900, 10: 1600 };

export const ADDON = {
  title: "PR Listing & Press Coverage",
  description: "Get your project featured in 50+ top crypto publications and news outlets including CoinMarketCap, Benzinga, BlockTelegraph, Business Insider, and MSN. Includes press release writing, editorial distribution to 500+ news sites, journalist outreach, AI discoverability on ChatGPT, Gemini, Claude and Perplexity, and a post-campaign coverage report.",
  price: 1500,
};

export const PR_LISTING = {
  title: "PR Listing & Press Coverage",
  description: "Get your project featured in 50+ top crypto publications and news outlets including CoinMarketCap, Benzinga, BlockTelegraph, Business Insider, and MSN. Includes press release writing, editorial distribution to 500+ news sites, journalist outreach, AI discoverability on ChatGPT, Gemini, Claude and Perplexity, and a post-campaign coverage report.",
  price: 1500,
};

export const HOMEPAGE_PIN_PRICE = 150;

type CartState = Record<string, number>;
type PinState = Record<string, boolean>;
export type ShortsQty = 0 | 1 | 5 | 10;

type CartContextType = {
  cart: CartState;
  pins: PinState;
  shortsQty: ShortsQty;
  setShortsQty: (qty: ShortsQty) => void;
  prListingEnabled: boolean;
  setPrListingEnabled: (v: boolean) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clearItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  togglePin: (id: string) => void;
  totalItems: number;
  uniqueChannels: number;
  totalReach: number;
  subtotal: number;
  bundleActive: boolean;
  channelTotal: number;
  savings: number;
  pinTotal: number;
  shortsTotal: number;
  prListingTotal: number;
  addonEnabled: boolean;
  setAddonEnabled: (v: boolean) => void;
  total: number;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});
  const [pins, setPins] = useState<PinState>({});
  const [addonEnabled, setAddonEnabled] = useState(false);
  const [shortsQty, setShortsQty] = useState<ShortsQty>(0);
  const [prListingEnabled, setPrListingEnabled] = useState(false);

  // Hydrate from ?cart= URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cartParam = params.get("cart");
    if (!cartParam) return;
    const newCart: CartState = {};
    const newPins: PinState = {};
    cartParam.split(",").forEach((seg) => {
      const parts = seg.trim().split(":");
      if (!parts[0]) return;
      const rawName = parts[0].toLowerCase();
      const qty = parseInt(parts[1] ?? "1");
      const hasPin = parts.includes("pin");
      const channel = CHANNELS.find(
        (c) => c.name.replace(/\s+/g, "").toLowerCase() === rawName
      );
      if (channel && qty > 0) {
        newCart[channel.id] = qty;
        if (hasPin) newPins[channel.id] = true;
      }
    });
    if (Object.keys(newCart).length > 0) {
      setCart(newCart);
      setPins(newPins);
    }
  }, []);

  const add = useCallback((id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })), []);

  const remove = useCallback((id: string) =>
    setCart((c) => {
      const next = { ...c };
      const v = (next[id] ?? 0) - 1;
      if (v <= 0) {
        delete next[id];
        setPins((p) => { const np = { ...p }; delete np[id]; return np; });
      } else next[id] = v;
      return next;
    }), []);

  const clearItem = useCallback((id: string) => {
    setCart((c) => { const next = { ...c }; delete next[id]; return next; });
    setPins((p) => { const next = { ...p }; delete next[id]; return next; });
  }, []);

  const setQty = useCallback((id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) {
        delete next[id];
        setPins((p) => { const np = { ...p }; delete np[id]; return np; });
      } else next[id] = qty;
      return next;
    }), []);

  const togglePin = useCallback((id: string) =>
    setPins((p) => ({ ...p, [id]: !p[id] })), []);

  const clear = useCallback(() => {
    setCart({});
    setPins({});
    setAddonEnabled(false);
    setShortsQty(0);
    setPrListingEnabled(false);
  }, []);

  const computed = useMemo(() => {
    const uniqueChannels = Object.keys(cart).length;
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalReach = Object.keys(cart).reduce((sum, id) => {
      const ch = CHANNELS.find((c) => c.id === id);
      return sum + (ch ? ch.subsNum : 0);
    }, 0);
    const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
      const ch = CHANNELS.find((c) => c.id === id);
      return sum + (ch ? ch.price * qty : 0);
    }, 0);

    const bestTierCount = ([7, 5, 3] as const).find((t) => uniqueChannels >= t);
    let channelTotal: number;
    let bundleActive: boolean;
    let savings: number;

    if (bestTierCount !== undefined) {
      const bundlePrice = BUNDLE_PRICES[bestTierCount];
      const channelEntries = Object.entries(cart)
        .map(([id, qty]) => {
          const ch = CHANNELS.find((c) => c.id === id)!;
          return { price: ch.price, qty };
        })
        .sort((a, b) => b.price - a.price);

      let bundleSlots = bestTierCount;
      let extraTotal = 0;
      for (const { price, qty } of channelEntries) {
        if (bundleSlots > 0) {
          bundleSlots--;
          if (qty > 1) extraTotal += price * (qty - 1);
        } else {
          extraTotal += price * qty;
        }
      }

      channelTotal = bundlePrice + extraTotal;
      bundleActive = true;
      savings = Math.max(0, subtotal - channelTotal);
    } else {
      channelTotal = subtotal;
      bundleActive = false;
      savings = 0;
    }

    const pinTotal = Object.entries(pins).reduce((sum, [id, on]) => {
      return sum + (on && cart[id] ? HOMEPAGE_PIN_PRICE : 0);
    }, 0);
    const shortsTotal = shortsQty > 0 ? (SHORTS_PRICES[shortsQty] ?? 0) : 0;
    const prListingTotal = prListingEnabled ? PR_LISTING.price : 0;
    const total = channelTotal + pinTotal + (addonEnabled ? ADDON.price : 0) + shortsTotal + prListingTotal;

    return { uniqueChannels, totalItems, totalReach, subtotal, bundleActive, channelTotal, savings, pinTotal, shortsTotal, prListingTotal, total };
  }, [cart, pins, addonEnabled, shortsQty, prListingEnabled]);

  const api = useMemo<CartContextType>(() => ({
    cart, pins, shortsQty, setShortsQty, prListingEnabled, setPrListingEnabled,
    add, remove, clearItem, setQty, togglePin,
    addonEnabled, setAddonEnabled, clear,
    ...computed,
  }), [cart, pins, shortsQty, prListingEnabled, add, remove, clearItem, setQty, togglePin, addonEnabled, clear, computed]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
