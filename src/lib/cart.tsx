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
};

export const CHANNELS: Channel[] = [
  { id: "cryptoocto", name: "Crypto Octo", subs: "86K", subsNum: 86000, price: 250, color: "#4a6cf7", link: "https://www.youtube.com/@CryptoOcto", contentType: "Market Analysis", image: octoImg },
  { id: "cryptonautic", name: "Crypto Nautic", subs: "100K", subsNum: 100000, price: 300, color: "#e53e3e", link: "https://www.youtube.com/@CryptoNautic", contentType: "News & Trends", image: nauticImg },
  { id: "freddiefinance", name: "Freddie Finance", subs: "112K", subsNum: 112000, price: 300, color: "#10b981", link: "https://www.youtube.com/@FreddieInFinance", contentType: "Web3 Education", image: freddieImg },
  { id: "cypherdefi", name: "Cypher DeFi", subs: "114K", subsNum: 114000, price: 350, color: "#f59e0b", link: "https://www.youtube.com/@cypherdefi", contentType: "DeFi Coverage", image: cypherImg },
  { id: "cryptochristo", name: "Crypto Christopher", subs: "137K", subsNum: 137000, price: 350, color: "#8b5cf6", link: "https://www.youtube.com/@ChristopherinCrypto", contentType: "Project Reviews", image: chrisImg },
  { id: "lennycrypto", name: "Lenny Crypto", subs: "161K", subsNum: 161000, price: 400, color: "#06b6d4", link: "https://www.youtube.com/@LennyCrypto", contentType: "Trading Signals", image: lennyImg },
  { id: "cryptosphere", name: "Crypto Sphere", subs: "191K", subsNum: 191000, price: 400, color: "#f97316", link: "https://www.youtube.com/@CryptoSphereDaily", contentType: "Token Tracking", image: sphereImg },
];

export const BUNDLE_DISCOUNTS: Record<number, number> = {
  3: 100,
  4: 100,
  5: 250,
  6: 250,
  7: 650,
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
    const discountKey = Math.min(totalItems, 7);
    const discount = BUNDLE_DISCOUNTS[discountKey] ?? 0;
    const pinTotal = Object.entries(pins).reduce((sum, [id, on]) => {
      return sum + (on && cart[id] ? HOMEPAGE_PIN_PRICE : 0);
    }, 0);
    const total = Math.max(0, subtotal - discount) + pinTotal + (addonEnabled ? ADDON.price : 0);
    return { uniqueChannels, totalItems, totalReach, subtotal, discount, pinTotal, total };
  }, [cart, pins, addonEnabled]);

  const api = useMemo<CartContextType>(() => ({
    cart,
    pins,
    add,
    remove,
    clearItem,
    setQty,
    togglePin,
    addonEnabled,
    setAddonEnabled,
    clear,
    ...computed,
  }), [cart, pins, add, remove, clearItem, setQty, togglePin, addonEnabled, clear, computed]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
