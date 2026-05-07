export type CartItemType = 'QUIZ_TEMPLATE' | 'QUESTION_SET' | 'TRAINING' | 'SUBSCRIPTION'

export interface CartItem {
  id: string
  type: CartItemType
  name: string
  price: number
  quantity: number
  metadata?: {
    templateId?: string
    questionSetId?: number
    entranceTypeSlug?: string
  }
}

export interface CartSummary {
  subtotal: number
  discount: number
  total: number
  itemCount: number
}
