import { useQuery } from '@tanstack/react-query'
import { entranceTypeApi } from '../services/entranceTypeApi'

export function useEntranceTypes() {
  return useQuery({
    queryKey: ['entranceTypes'],
    queryFn: entranceTypeApi.getEntranceTypes,
    staleTime: 30 * 60 * 1000,
  })
}

export function useEntranceType(id: number) {
  return useQuery({
    queryKey: ['entranceType', id],
    queryFn: () => entranceTypeApi.getEntranceTypeById(id),
    enabled: !!id,
  })
}

export function useEntranceTypeBySlug(slug: string) {
  return useQuery({
    queryKey: ['entranceType', 'slug', slug],
    queryFn: () => entranceTypeApi.getEntranceTypeBySlug(slug),
    enabled: !!slug,
  })
}
