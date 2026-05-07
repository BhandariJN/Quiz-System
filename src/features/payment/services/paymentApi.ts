import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'

export type PaymentMethod = 'ESEWA' | 'KHALTI' | 'IMEPAY' | 'BANK_TRANSFER' | 'FONE_PAY_QR' | 'CASH' | 'FREE'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface EsewaPaymentResponse {
  amount: string
  taxAmount: string
  totalAmount: string
  transactionUuid: string
  productCode: string
  productServiceCharge: string
  productDeliveryCharge: string
  successUrl: string
  failureUrl: string
  signedFieldNames: string
  signature: string
  esewaUrl: string
}

export interface KhaltiPaymentResponse {
  pidx: string
  paymentUrl: string
  expiresAt: string
  expiresIn: number
}

export type PaymentInitiateResponse = EsewaPaymentResponse | KhaltiPaymentResponse

export interface PaymentStatusResponse {
  product_code?: string
  transaction_uuid?: string
  total_amount?: number
  status: string
  ref_id?: string
  pidx?: string
  transaction_id?: string
  fee?: number
  refunded?: boolean
}

export const paymentApi = {
  initiatePayment: async (data: {
    amount: number
    paymentMethod: PaymentMethod
    moduleId?: string
    moduleType?: string
    moduleIds?: string[]
    remarks?: string
    transactionReference?: string
  }) => {
    const response = await api.post<ApiResponse<PaymentInitiateResponse>>('/payments/initiate', data)
    return response.data.data
  },

  checkEsewaStatus: async (transactionUuid: string) => {
    const response = await api.get<ApiResponse<PaymentStatusResponse>>(`/payments/status/${transactionUuid}`)
    return response.data.data
  },

  checkKhaltiStatus: async (pidx: string) => {
    const response = await api.get<ApiResponse<PaymentStatusResponse>>(`/payments/khalti/status/${pidx}`)
    return response.data.data
  },
}
