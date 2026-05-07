import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/features/cart/stores/cartStore'
import { useInitiatePayment } from '@/features/payment/hooks/usePayment'
import { PaymentMethod } from '@/features/payment/services/paymentApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/useToast'
import { Loader2, CheckCircle } from 'lucide-react'

const paymentMethodLabels: Record<PaymentMethod, string> = {
  ESEWA: 'eSewa',
  KHALTI: 'Khalti',
  IMEPAY: 'IME Pay',
  BANK_TRANSFER: 'Bank Transfer',
  FONE_PAY_QR: 'FonePay QR',
  CASH: 'Cash',
  FREE: 'Free',
}

export default function CheckoutPage() {
  useNavigate();
  const { items, totalPrice, clearCart } = useCartStore()
  const { toast } = useToast()
  const initiatePayment = useInitiatePayment()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ESEWA')

  if (items.length === 0) {
    return (
      <div className="container py-8 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground">Add items to proceed with checkout.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = totalPrice()
    const moduleIds = items.map((item) => item.metadata?.questionSetId?.toString() || item.id)
    
    try {
      const response = await initiatePayment.mutateAsync({
        amount,
        paymentMethod,
        moduleIds,
        moduleType: 'QUESTION_SET',
        remarks: `Purchase of ${items.length} item(s)`,
      })

      // Handle eSewa response
      if ('esewaUrl' in response) {
        // Create form and submit to eSewa
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = response.esewaUrl
        
        const fields = [
          { name: 'amount', value: response.amount },
          { name: 'tax_amount', value: response.taxAmount },
          { name: 'total_amount', value: response.totalAmount },
          { name: 'transaction_uuid', value: response.transactionUuid },
          { name: 'product_code', value: response.productCode },
          { name: 'product_service_charge', value: response.productServiceCharge },
          { name: 'product_delivery_charge', value: response.productDeliveryCharge },
          { name: 'success_url', value: response.successUrl },
          { name: 'failure_url', value: response.failureUrl },
          { name: 'signed_field_names', value: response.signedFieldNames },
          { name: 'signature', value: response.signature },
        ]
        
        fields.forEach((field) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = field.name
          input.value = field.value
          form.appendChild(input)
        })
        
        document.body.appendChild(form)
        form.submit()
      }
      // Handle Khalti response
      else if ('paymentUrl' in response) {
        window.location.href = response.paymentUrl
      }
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} className="space-y-3">
                {(['ESEWA', 'KHALTI', 'BANK_TRANSFER', 'CASH'] as PaymentMethod[]).map((method) => (
                  <div key={method} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={method} id={method} />
                    <Label htmlFor={method} className="flex items-center gap-2 flex-1 cursor-pointer">
                      {paymentMethodLabels[method]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={initiatePayment.isPending}>
            {initiatePayment.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Pay ${totalPrice().toFixed(2)}
              </>
            )}
          </Button>
        </form>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
