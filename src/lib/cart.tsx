import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

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
  { id: "cryptoocto",    name: "Crypto Octo",       subs: "86K",  subsNum: 86000,  price: 250, color: "#6366f1", link: "https://www.youtube.com/@CryptoOcto",         contentType: "Market Analysis", image: octoImg,   avgViews: "~8K",  engagementRate: "9.5%", audienceDesc: "US retail-heavy, strong altcoin conviction" },
  { id: "cryptonautic",  name: "Crypto Nautic",      subs: "100K", subsNum: 100000, price: 300, color: "#0ea5e9", link: "https://www.youtube.com/@CryptoNautic",        contentType: "News & Trends",   image: nauticImg, avgViews: "~12K", engagementRate: "9.2%", audienceDesc: "European audience, macro and DeFi traders" },
  { id: "freddiefinance",name: "Freddie Finance",    subs: "112K", subsNum: 112000, price: 300, color: "#7c3aed", link: "https://www.youtube.com/@FreddieInFinance",    contentType: "Web3 Education",  image: freddieImg,avgViews: "~15K", engagementRate: "11.3%",audienceDesc: "Beginner-friendly tone, unusually high comment rate", badge: "High Engagement" },
  { id: "cypherdefi",    name: "Cypher DeFi",        subs: "114K", subsNum: 114000, price: 350, color: "#2563eb", link: "https://www.youtube.com/@cypherdefi",          contentType: "DeFi Coverage",   image: cypherImg, avgViews: "~18K", engagementRate: "10.1%",audienceDesc: "On-chain natives, heavy protocol and DeFi interest" },
  { id: "cryptochristo", name: "Crypto Christopher", subs: "137K", subsNum: 137000, price: 350, color: "#ef4444", link: "https://www.youtube.com/@ChristopherinCrypto", contentType: "Project Reviews", image: chrisImg,  avgViews: "~22K", engagementRate: "9.8%", audienceDesc: "Mid/large-cap holders, project-review driven buyers" },
  { id: "lennycrypto",   name: "Lenny Crypto",       subs: "161K", subsNum: 161000, price: 400, color: "#a855f7", link: "https://www.youtube.com/@LennyCrypto",         contentType: "Trading Signals", image: lennyImg,  avgViews: "~28K", engagementRate: "10.7%",audienceDesc: "High-intent traders, strong repeat buyer behaviour", badge: "Most Picked" },
  { id: "cryptosphere",  name: "Crypto Sphere",      subs: "191K", subsNum: 191000, price: 400, color: "#9333ea", link: "https://www.youtube.com/@CryptoSphereDaily",   contentType: "Token Tracking",  image: sphereImg, avgViews: "~35K", engagementRate: "10.2%",audienceDesc: "Token and launch trackers, news-reactive buyers" },
];

// Fixed flat price when exactly 3, 5, or 7 unique channels are selected
export const BUNDLE_PRICES: Record<number, number> = {
  3: 900,
  5: 1400,
  7: 1850,
};

export const SHORTS_PRICES: Record<number, number> = {
  1: 200,
  5: 900,
  10: 1600,
};

export const ADDON = {
  title: "Featured Placement Boost",
  description: "Add a powerful promotional boost to your campaign for maximum visibility.",
  price: 250,
};

export const PR_LISTING = {
  title: "PR Listing & Press Coverage",
  description: "Get your project featured in 50+ top crypto publications and news outlets. Includes press release distribution, editorial placement, and a post-campaign coverage report.",
  price: 350,
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

    // Find highest bundle tier that fits within the selected unique channels
    const bestTierCount = ([7, 5, 3] as const).find((t) => uniqueChannels >= t);
    let channelTotal: number;
    let bundleActive: boolean;
    let savings: number;

    if (bestTierCount !== undefined) {
      const bundlePrice = BUNDLE_PRICES[bestTierCount];
      // Sort channels descending by price: most expensive go into the bundle slot,
      // cheapest extras pay individual prices — giving the user the best deal.
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
          // First copy of this channel is covered by the bundle;
          // any extra copies beyond qty=1 pay individual price
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
