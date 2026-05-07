import { EntranceType } from '@/features/entrance-types/types/entranceType.types'

/**
 * Get entrance type slug from ID
 */
export const getEntranceTypeSlug = (entranceTypeId: number, entranceTypes: EntranceType[]): string | null => {
  const type = entranceTypes.find((t) => t.entranceTypeId === entranceTypeId)
  return type?.slug || null
}

/**
 * Get entrance type ID from slug
 */
export const getEntranceTypeId = (entranceSlug: string, entranceTypes: EntranceType[]): number | null => {
  const type = entranceTypes.find((t) => t.slug === entranceSlug)
  return type?.entranceTypeId || null
}

/**
 * Get entrance type by slug
 */
export const getEntranceTypeBySlug = (slug: string, entranceTypes: EntranceType[]): EntranceType | undefined => {
  return entranceTypes.find((t) => t.slug === slug)
}

/**
 * Get entrance type by ID
 */
export const getEntranceTypeById = (id: number, entranceTypes: EntranceType[]): EntranceType | undefined => {
  return entranceTypes.find((t) => t.entranceTypeId === id)
}
