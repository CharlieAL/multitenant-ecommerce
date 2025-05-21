import { useCallback } from 'react'
import { useCartStore } from '../store/use-cart-store'
import { useShallow } from 'zustand/react/shallow'

export const useCart = (tenantSlug: string) => {
  const add = useCartStore(state => state.add)
  const remove = useCartStore(state => state.remove)
  const clear = useCartStore(state => state.clear)
  const clearAllCarts = useCartStore(state => state.clearAllCarts)

  const productsIds = useCartStore(
    useShallow(state => state.tenantCarts[tenantSlug]?.productsIds || [])
  )

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productsIds.includes(productId)) {
        remove(tenantSlug, productId)
      } else {
        add(tenantSlug, productId)
      }
    },
    [add, remove, productsIds, tenantSlug]
  )

  const hasProduct = useCallback(
    (productId: string) => {
      return productsIds.includes(productId)
    },
    [productsIds]
  )

  const clearTenantCart = useCallback(() => {
    clear(tenantSlug)
  }, [tenantSlug, clear])

  const handleAddProduct = useCallback(
    (productId: string) => {
      add(tenantSlug, productId)
    },
    [tenantSlug, add]
  )
  const handleRemoveProduct = useCallback(
    (productId: string) => {
      remove(tenantSlug, productId)
    },
    [tenantSlug, remove]
  )
  return {
    productsIds,
    add: handleAddProduct,
    remove: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    hasProduct,
    totalProducts: productsIds.length
  }
}
