import { apiClient } from './client'
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },
}

