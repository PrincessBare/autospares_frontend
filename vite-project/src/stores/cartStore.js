import { create } from 'zustand';
import { STORAGE_KEYS } from '../config/constants';

export const useCartStore = create((set, get) => ({
  items: localStorage.getItem(STORAGE_KEYS.CART)
    ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CART))
    : [],
  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({
        ...product,
        quantity,
      });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    set({ items: [...items] });
  },
  removeItem: (productId) => {
    const items = get().items.filter((item) => item.id !== productId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    set({ items });
  },
  updateQuantity: (productId, quantity) => {
    const items = get().items;
    const item = items.find((item) => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        get().removeItem(productId);
      } else {
        item.quantity = quantity;
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
        set({ items: [...items] });
      }
    }
  },
  clearCart: () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
    set({ items: [] });
  },
  getCartTotal: () => {
    return get().items.reduce(
      (total, item) => total + (item.price * item.quantity || 0),
      0
    );
  },
  getCartCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
