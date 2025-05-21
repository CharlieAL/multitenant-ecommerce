import { create } from 'zustand'
import {
  persist,
  createJSONStorage
} from 'zustand/middleware'

interface TenantCart {
  productsIds: string[]
}

interface CartState {
  tenantCarts: Record<string, TenantCart>
  add: (
    tenantSlug: string,
    productId: string
  ) => void
  remove: (
    tenantSlug: string,
    productId: string
  ) => void
  clear: (tenantSlug: string) => void
  clearAllCarts: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      tenantCarts: {},
      add: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productsIds: [
                ...(state.tenantCarts[tenantSlug]
                  ?.productsIds || []),
                productId
              ]
            }
          }
        })),
      remove: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productsIds:
                state.tenantCarts[
                  tenantSlug
                ]?.productsIds.filter(
                  (id) => id !== productId
                ) || []
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
      clearAllCarts: () =>
        set({ tenantCarts: {} })
    }),
    {
      name: 'funroad-cart-storage',
      storage: createJSONStorage(
        () => localStorage
      )
    }
  )
)
