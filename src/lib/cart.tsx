import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type Channel = {
  id: string;
  name: string;
  subs: string;
  subsNum: number;
  price: number;
  color: string;
  link: string;
  contentType: string;
};

export const CHANNELS: Channel[] = [
  { id: "cryptovault", name: "CryptoVault", subs: "85K", subsNum: 85000, price: 500, color: "#4a6cf7", link: "#", contentType: "Market Analysis" },
  { id: "blocktalk", name: "BlockTalk", subs: "62K", subsNum: 62000, price: 450, color: "#e53e3e", link: "#", contentType: "News & Trends" },
  { id: "web3wire", name: "Web3Wire", subs: "47K", subsNum: 47000, price: 400, color: "#10b981", link: "#", contentType: "Web3 Education" },
  { id: "chainreview", name: "ChainReview", subs: "38K", subsNum: 38000, price: 380, color: "#f59e0b", link: "#", contentType: "Project Reviews" },
  { id: "altsignals", name: "AltSignals", subs: "29K", subsNum: 29000, price: 350, color: "#8b5cf6", link: "#", contentType: "Trading Signals" },
  { id: "tokenwatch", name: "TokenWatch", subs: "24K", subsNum: 24000, price: 320, color: "#06b6d4", link: "#", contentType: "Token Tracking" },
  { id: "defidaily", name: "DefiDaily", subs: "19K", subsNum: 19000, price: 300, color: "#f97316", link: "#", contentType: "DeFi Coverage" },
];

export const BUNDLE_DISCOUNTS: Record<number, number> = {
  3: 200,
  4: 200,
  5: 350,
  6: 350,
  7: 500,
};

export const ADDON = {
  title: "Featured Placement Boost",
  description: "Add a powerful promotional boost to your campaign for maximum visibility.",
  price: 250,
};

export const HOMEPAGE_PIN_PRICE = 150;

type CartState = Record<string, number>;
type PinState = Record<string, boolean>;

type CartContextType = {
  cart: CartState;
  pins: PinState;
  add: (id: string) => void;
  remove: (id: string) => void;
  clearItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  togglePin: (id: string) => void;
  totalItems: number;
  uniqueChannels: number;
  totalReach: number;
  subtotal: number;
  discount: number;
  pinTotal: number;
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

  const api = useMemo<CartContextType>(() => {
    const add = (id: string) =>
      setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    const remove = (id: string) =>
      setCart((c) => {
        const next = { ...c };
        const v = (next[id] ?? 0) - 1;
        if (v <= 0) {
          delete next[id];
          setPins((p) => { const np = { ...p }; delete np[id]; return np; });
        } else next[id] = v;
        return next;
      });
    const clearItem = (id: string) => {
      setCart((c) => { const next = { ...c }; delete next[id]; return next; });
      setPins((p) => { const next = { ...p }; delete next[id]; return next; });
    };
    const setQty = (id: string, qty: number) =>
      setCart((c) => {
        const next = { ...c };
        if (qty <= 0) {
          delete next[id];
          setPins((p) => { const np = { ...p }; delete np[id]; return np; });
        } else next[id] = qty;
        return next;
      });
    const togglePin = (id: string) =>
      setPins((p) => ({ ...p, [id]: !p[id] }));
    const clear = () => {
      setCart({});
      setPins({});
      setAddonEnabled(false);
    };

    const uniqueChannels = Object.keys(cart).length;
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
      const ch = CHANNELS.find((c) => c.id === id);
      return sum + (ch ? ch.price * qty : 0);
    }, 0);
    const totalReach = Object.keys(cart).reduce((sum, id) => {
      const ch = CHANNELS.find((c) => c.id === id);
      return sum + (ch ? ch.subsNum : 0);
    }, 0);
    const discountKey = Math.min(totalItems, 7);
    const discount = BUNDLE_DISCOUNTS[discountKey] ?? 0;
    const pinTotal = Object.entries(pins).reduce((sum, [id, on]) => {
      return sum + (on && cart[id] ? HOMEPAGE_PIN_PRICE : 0);
    }, 0);
    const total = Math.max(0, subtotal - discount) + pinTotal + (addonEnabled ? ADDON.price : 0);

    return {
      cart,
      pins,
      add,
      remove,
      clearItem,
      setQty,
      togglePin,
      totalItems,
      uniqueChannels,
      totalReach,
      subtotal,
      discount,
      pinTotal,
      addonEnabled,
      setAddonEnabled,
      total,
      clear,
    };
  }, [cart, pins, addonEnabled]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
