import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '../services/cartApi'
import { useToast } from '@/hooks/useToast'
import { CartItem } from '../types/cart.types'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    staleTime: 1 * 60 * 1000,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data)
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add item',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data)
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed',
      })
    },
  })
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateQuantity(itemId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data)
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.setQueryData(['cart'], { items: [], subtotal: 0, discount: 0, total: 0 })
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed',
      })
    },
  })
}
