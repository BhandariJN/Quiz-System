import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '../types/cart.types'

interface CartState {
  items: CartItem[]
  isOpen: boolean

  itemCount: () => number
  totalPrice: () => number

  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  isInCart: (id: string) => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id)
          if (existingIndex >= 0) {
            const newItems = [...state.items]
            newItems[existingIndex].quantity += 1
            return { items: newItems, isOpen: true }
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            isOpen: true,
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.id !== id)
            : state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
        })),

      clearCart: () => set({ items: [], isOpen: false }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      isInCart: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: 'cart-storage',
    }
  )
)
