import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'
import { CartItem } from '../types/cart.types'

export interface CartResponse {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
}

export const cartApi = {
  getCart: async () => {
    const response = await api.get<ApiResponse<CartResponse>>('/cart')
    return response.data.data
  },

  addItem: async (item: Omit<CartItem, 'quantity'>) => {
    const response = await api.post<ApiResponse<CartResponse>>('/cart/items', item)
    return response.data.data
  },

  removeItem: async (itemId: string) => {
    const response = await api.delete<ApiResponse<CartResponse>>(`/cart/items/${itemId}`)
    return response.data.data
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const response = await api.put<ApiResponse<CartResponse>>(`/cart/items/${itemId}`, { quantity })
    return response.data.data
  },

  clearCart: async () => {
    const response = await api.delete<ApiResponse<CartResponse>>('/cart')
    return response.data.data
  },
}
