import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'
import { EntranceType, EntranceTypeDetail } from '../types/entranceType.types'

export const entranceTypeApi = {
  getEntranceTypes: async () => {
    const response = await api.get<ApiResponse<EntranceType[]>>('/entrance-types')
    return response.data.data
  },

  getEntranceTypeById: async (id: number) => {
    const response = await api.get<ApiResponse<EntranceTypeDetail>>(`/entrance-types/${id}`)
    return response.data.data
  },

  getEntranceTypeBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<EntranceTypeDetail>>(`/entrance-types/slug/${slug}`)
    return response.data.data
  },
}
