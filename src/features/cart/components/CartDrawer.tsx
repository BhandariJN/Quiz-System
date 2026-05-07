import { useCartStore } from '../stores/cartStore'
import { Button } from '@/components/ui/button'
import { X, ShoppingCart, Trash2 } from 'lucide-react'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, totalPrice, itemCount } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {itemCount()}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{item.type.toLowerCase().replace('_', ' ')}</p>
                  <p className="font-semibold mt-1">${item.price}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={() => window.location.href = '/checkout'}>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
