import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCheckEsewaStatus, useCheckKhaltiStatus } from '@/features/payment/hooks/usePayment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function PaymentCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'canceled'>('loading')
  const [message, setMessage] = useState('Verifying your payment...')

  const paymentStatus = searchParams.get('payment')
  const method = searchParams.get('method')
  const reason = searchParams.get('reason')
  const transactionUuid = searchParams.get('transactionUuid')
  const pidx = searchParams.get('pidx')

  // Check eSewa status if transaction UUID is present
  const { data: esewaData, isLoading: esewaLoading } = useCheckEsewaStatus(transactionUuid || '')
  
  // Check Khalti status if pidx is present
  const { data: khaltiData, isLoading: khaltiLoading } = useCheckKhaltiStatus(pidx || '')

  useEffect(() => {
    // Handle based on query params from callback
    if (paymentStatus === 'success') {
      setStatus('success')
      setMessage('Payment completed successfully!')
      toast({
        title: 'Payment Successful',
        description: 'Your purchase has been completed.',
      })
    } else if (paymentStatus === 'failed') {
      setStatus('failed')
      setMessage(reason === 'verification_failed' 
        ? 'Payment verification failed. Please contact support.' 
        : 'Payment was not completed. Please try again.')
      toast({
        title: 'Payment Failed',
        description: 'Your payment could not be processed.',
        variant: 'destructive',
      })
    } else if (paymentStatus === 'canceled') {
      setStatus('canceled')
      setMessage('Payment was canceled. You can try again anytime.')
    } else if (paymentStatus === 'pending') {
      setStatus('loading')
      setMessage('Payment is pending verification...')
    }
  }, [paymentStatus, reason, toast])

  // Auto-redirect after success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/library')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, navigate])

  const isLoading = status === 'loading' || esewaLoading || khaltiLoading

  return (
    <div className="container py-8 max-w-lg mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {isLoading ? (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            ) : status === 'success' ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : status === 'canceled' ? (
              <AlertCircle className="h-16 w-16 text-yellow-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isLoading ? 'Processing Payment' : status === 'success' ? 'Payment Successful!' : status === 'canceled' ? 'Payment Canceled' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{message}</p>

          {status === 'success' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                Redirecting to your library in 3 seconds...
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {status === 'success' ? (
              <Button onClick={() => navigate('/library')}>
                Go to Library
              </Button>
            ) : status === 'failed' || status === 'canceled' ? (
              <>
                <Button variant="outline" onClick={() => navigate('/cart')}>
                  Try Again
                </Button>
                <Button onClick={() => navigate('/plans')}>
                  View Plans
                </Button>
              </>
            ) : (
              <Button disabled>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </Button>
            )}
          </div>

          {(esewaData || khaltiData) && (
            <div className="text-xs text-muted-foreground mt-4">
              <p>Transaction Details:</p>
              {esewaData && (
                <p>Status: {esewaData.status} | Ref: {esewaData.ref_id}</p>
              )}
              {khaltiData && (
                <p>Status: {khaltiData.status} | Transaction: {khaltiData.transaction_id}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
