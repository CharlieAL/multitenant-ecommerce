import { useCartStore } from '../store/use-cart-store'

export const useCart = (tenantSlug: string) => {
  const { add, remove, clear, clearAllCarts, getCartByTenant } = useCartStore()

  const productsIds = getCartByTenant(tenantSlug)

  const toggleProduct = (productId: string) => {
    if (productsIds.includes(productId)) {
      remove(tenantSlug, productId)
    } else {
      add(tenantSlug, productId)
    }
  }

  const hasProduct = (productId: string) => {
    return productsIds.includes(productId)
  }

  const clearTenantCart = () => {
    clear(tenantSlug)
  }
  return {
    productsIds,
    add: (productId: string) => add(tenantSlug, productId),
    remove: (productId: string) => remove(tenantSlug, productId),
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    hasProduct,
    totalProducts: productsIds.length
  }
}
