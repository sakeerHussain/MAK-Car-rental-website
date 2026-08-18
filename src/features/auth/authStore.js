import { create } from 'zustand';

/**
 * @typedef {import('@/shared/models/typedefs').User} User
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user
 * @property {string | null} accessToken
 * @property {boolean} isInitialized
 * @property {(user: User, token: string) => void} setSession
 * @property {() => void} clearSession
 * @property {() => void} markInitialized
 * @property {(role: string) => boolean} hasRole
 * @property {(permission: string) => boolean} hasPermission
 * @property {() => boolean} hasCorporateAccess
 * @property {() => boolean} hasCorporateInvoiceAccess
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AuthState>>} */
export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isInitialized: false,

  setSession: (user, token) => set({ user, accessToken: token }),
  clearSession: () => set({ user: null, accessToken: null }),
  markInitialized: () => set({ isInitialized: true }),

  hasRole: (role) => get().user?.role === role,

  hasPermission: (permission) => {
    const user = get().user;
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (user.role === 'STAFF') {
      return user.permissions?.includes(permission) ?? false;
    }
    return false;
  },

  hasCorporateAccess: () => Boolean(get().user?.hasCorporateAccess),

  hasCorporateInvoiceAccess: () => {
    const role = get().user?.corporateMemberRole;
    return role === 'VIEWER' || role === 'BILLING';
  },
}));
