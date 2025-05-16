import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TenantCart {
  productsIds: string[]
}

interface CartState {
  tenantCarts: Record<string, TenantCart>
  add: (tenantSlug: string, productId: string) => void
  remove: (tenantSlug: string, productId: string) => void
  clear: (tenantSlug: string) => void
  clearAllCarts: () => void
  getCartByTenant: (tenantSlug: string) => string[]
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tenantCarts: {},
      add: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productsIds: [...(state.tenantCarts[tenantSlug]?.productsIds || []), productId]
            }
          }
        })),
      remove: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productsIds:
                state.tenantCarts[tenantSlug]?.productsIds.filter((id) => id !== productId) || []
            }
          }
        })),
      clear: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productsIds: []
            }
          }
        })),
      clearAllCarts: () => set({ tenantCarts: {} }),
      getCartByTenant: (tenantSlug) => get().tenantCarts[tenantSlug]?.productsIds || []
    }),
    {
      name: 'funroad-cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
