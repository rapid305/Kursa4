import { apiClient } from './client'
import { User } from '../types'

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/')
    return response.data
  },

  getById: async (uuid: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${uuid}`)
    return response.data
  },

  update: async (uuid: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${uuid}`, data)
    return response.data
  },

  delete: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/users/${uuid}`)
  },
}

