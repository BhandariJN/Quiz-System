export interface EntranceType {
  entranceTypeId: number
  entranceName: string
  description: string
  slug: string
  icon?: string
  isActive: boolean
  hasNegativeMarking?: boolean
  negativeMarkingValue?: number
}

export interface EntranceTypeDetail extends EntranceType {
  courseCount: number
  templateCount: number
  totalQuestions: number
}
