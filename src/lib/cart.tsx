import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type Channel = {
  id: string;
  name: string;
  subs: string;
  subsNum: number;
  price: number;
  color: string;
  link: string;
};

export const CHANNELS: Channel[] = [
  { id: "cryptovault", name: "CryptoVault", subs: "85K", subsNum: 85000, price: 500, color: "#4a6cf7", link: "#" },
  { id: "blocktalk", name: "BlockTalk", subs: "62K", subsNum: 62000, price: 450, color: "#e53e3e", link: "#" },
  { id: "web3wire", name: "Web3Wire", subs: "47K", subsNum: 47000, price: 400, color: "#22c55e", link: "#" },
  { id: "chainreview", name: "ChainReview", subs: "38K", subsNum: 38000, price: 380, color: "#f59e0b", link: "#" },
  { id: "altsignals", name: "AltSignals", subs: "29K", subsNum: 29000, price: 350, color: "#a855f7", link: "#" },
  { id: "tokenwatch", name: "TokenWatch", subs: "24K", subsNum: 24000, price: 320, color: "#06b6d4", link: "#" },
  { id: "defidaily", name: "DefiDaily", subs: "19K", subsNum: 19000, price: 300, color: "#ec4899", link: "#" },
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

type CartState = Record<string, number>;

type CartContextType = {
  cart: CartState;
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  totalItems: number;
  uniqueChannels: number;
  subtotal: number;
  discount: number;
  addonEnabled: boolean;
  setAddonEnabled: (v: boolean) => void;
  total: number;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});
  const [addonEnabled, setAddonEnabled] = useState(false);

  const api = useMemo<CartContextType>(() => {
    const add = (id: string) =>
      setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    const remove = (id: string) =>
      setCart((c) => {
        const next = { ...c };
        const v = (next[id] ?? 0) - 1;
        if (v <= 0) delete next[id];
        else next[id] = v;
        return next;
      });
    const setQty = (id: string, qty: number) =>
      setCart((c) => {
        const next = { ...c };
        if (qty <= 0) delete next[id];
        else next[id] = qty;
        return next;
      });
    const clear = () => {
      setCart({});
      setAddonEnabled(false);
    };

    const uniqueChannels = Object.keys(cart).length;
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
      const ch = CHANNELS.find((c) => c.id === id);
      return sum + (ch ? ch.price * qty : 0);
    }, 0);
    const discount = BUNDLE_DISCOUNTS[uniqueChannels] ?? 0;
    const total = Math.max(0, subtotal - discount) + (addonEnabled ? ADDON.price : 0);

    return {
      cart,
      add,
      remove,
      setQty,
      totalItems,
      uniqueChannels,
      subtotal,
      discount,
      addonEnabled,
      setAddonEnabled,
      total,
      clear,
    };
  }, [cart, addonEnabled]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
