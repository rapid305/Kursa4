import { apiClient } from './client'
import { Animal, AnimalCreate, Species, SpeciesCreate, Enclosure, EnclosureCreate } from '../types'
import { apiCache } from './cache'

export const zooApi = {
  // Animals
  getAnimals: async (params?: {
    skip?: number
    limit?: number
    search?: string
    species_uuid?: string
    enclosure_uuid?: string
  }): Promise<Animal[]> => {
    const endpoint = '/animals/'
    const key = apiCache.makeKey(endpoint, params)
    const cached = apiCache.get<Animal[]>(key)
    if (cached) return cached
    const response = await apiClient.get<Animal[]>(endpoint, { params })
    apiCache.set(key, response.data)
    return response.data
  },

  getAnimal: async (uuid: string): Promise<Animal> => {
    const endpoint = `/animals/${uuid}`
    const key = apiCache.makeKey(endpoint)
    const cached = apiCache.get<Animal>(key)
    if (cached) return cached
    const response = await apiClient.get<Animal>(endpoint)
    apiCache.set(key, response.data)
    return response.data
  },

  createAnimal: async (data: AnimalCreate): Promise<Animal> => {
    const response = await apiClient.post<Animal>('/animals/', data)
    // Invalidate animals-related cache
    apiCache.invalidateByPrefix('/animals/')
    return response.data
  },

  updateAnimal: async (uuid: string, data: Partial<AnimalCreate>): Promise<Animal> => {
    const response = await apiClient.put<Animal>(`/animals/${uuid}`, data)
    apiCache.invalidateByPrefix('/animals/')
    return response.data
  },

  deleteAnimal: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/animals/${uuid}`)
    apiCache.invalidateByPrefix('/animals/')
  },

  // Species
  getSpecies: async (params?: {
    skip?: number
    limit?: number
    search?: string
  }): Promise<Species[]> => {
    const endpoint = '/species/'
    const key = apiCache.makeKey(endpoint, params)
    const cached = apiCache.get<Species[]>(key)
    if (cached) return cached
    const response = await apiClient.get<Species[]>(endpoint, { params })
    apiCache.set(key, response.data)
    return response.data
  },

  getSpeciesById: async (uuid: string): Promise<Species> => {
    const endpoint = `/species/${uuid}`
    const key = apiCache.makeKey(endpoint)
    const cached = apiCache.get<Species>(key)
    if (cached) return cached
    const response = await apiClient.get<Species>(endpoint)
    apiCache.set(key, response.data)
    return response.data
  },

  createSpecies: async (data: SpeciesCreate): Promise<Species> => {
    const response = await apiClient.post<Species>('/species/', data)
    apiCache.invalidateByPrefix('/species/')
    return response.data
  },

  updateSpecies: async (uuid: string, data: Partial<SpeciesCreate>): Promise<Species> => {
    const response = await apiClient.put<Species>(`/species/${uuid}`, data)
    apiCache.invalidateByPrefix('/species/')
    return response.data
  },

  deleteSpecies: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/species/${uuid}`)
    apiCache.invalidateByPrefix('/species/')
  },

  // Enclosures
  getEnclosures: async (params?: {
    skip?: number
    limit?: number
    search?: string
  }): Promise<Enclosure[]> => {
    const endpoint = '/enclosures/'
    const key = apiCache.makeKey(endpoint, params)
    const cached = apiCache.get<Enclosure[]>(key)
    if (cached) return cached
    const response = await apiClient.get<Enclosure[]>(endpoint, { params })
    apiCache.set(key, response.data)
    return response.data
  },

  getEnclosureById: async (uuid: string): Promise<Enclosure> => {
    const endpoint = `/enclosures/${uuid}`
    const key = apiCache.makeKey(endpoint)
    const cached = apiCache.get<Enclosure>(key)
    if (cached) return cached
    const response = await apiClient.get<Enclosure>(endpoint)
    apiCache.set(key, response.data)
    return response.data
  },

  createEnclosure: async (data: EnclosureCreate): Promise<Enclosure> => {
    const response = await apiClient.post<Enclosure>('/enclosures/', data)
    apiCache.invalidateByPrefix('/enclosures/')
    return response.data
  },

  updateEnclosure: async (uuid: string, data: Partial<EnclosureCreate>): Promise<Enclosure> => {
    const response = await apiClient.put<Enclosure>(`/enclosures/${uuid}`, data)
    apiCache.invalidateByPrefix('/enclosures/')
    return response.data
  },

  deleteEnclosure: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/enclosures/${uuid}`)
    apiCache.invalidateByPrefix('/enclosures/')
  },
}
