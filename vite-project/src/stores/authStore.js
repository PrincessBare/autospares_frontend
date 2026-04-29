

import { create } from 'zustand';
import { STORAGE_KEYS } from '../config/constants';

export const useAuthStore = create((set, get) => ({
  // State
  user: localStorage.getItem(STORAGE_KEYS.USER)
    ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))
    : null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,

  
  login: (user, token) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    set({ user: null, token: null });
  },


  setUser: (updatedUser) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },


  getToken: () => get().token,


  isAuthenticated: () => !!get().token && !!get().user,
}));
