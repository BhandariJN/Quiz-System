import { useMutation, useQuery } from '@tanstack/react-query'
import { paymentApi, PaymentMethod } from '../services/paymentApi'
import { useToast } from '@/hooks/useToast'

export function useInitiatePayment() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: paymentApi.initiatePayment,
    onSuccess: (data) => {
      toast({
        title: 'Payment Initiated',
        description: 'Redirecting to payment gateway...',
      })
      // Return data for handling redirect in component
      return data
    },
    onError: (error: Error) => {
      toast({
        title: 'Payment Initiation Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      })
    },
  })
}

export function useCheckEsewaStatus(transactionUuid: string) {
  return useQuery({
    queryKey: ['paymentStatus', 'esewa', transactionUuid],
    queryFn: () => paymentApi.checkEsewaStatus(transactionUuid),
    enabled: !!transactionUuid,
  })
}

export function useCheckKhaltiStatus(pidx: string) {
  return useQuery({
    queryKey: ['paymentStatus', 'khalti', pidx],
    queryFn: () => paymentApi.checkKhaltiStatus(pidx),
    enabled: !!pidx,
  })
}
