import { apiClient } from './client'
import { Animal, AnimalCreate, Species, SpeciesCreate, Enclosure, EnclosureCreate } from '../types'

export const zooApi = {
  // Animals
  getAnimals: async (params?: {
    skip?: number
    limit?: number
    search?: string
    species_uuid?: string
    enclosure_uuid?: string
  }): Promise<Animal[]> => {
    const response = await apiClient.get<Animal[]>('/animals/', { params })
    return response.data
  },

  getAnimal: async (uuid: string): Promise<Animal> => {
    const response = await apiClient.get<Animal>(`/animals/${uuid}`)
    return response.data
  },

  createAnimal: async (data: AnimalCreate): Promise<Animal> => {
    const response = await apiClient.post<Animal>('/animals/', data)
    return response.data
  },

  updateAnimal: async (uuid: string, data: Partial<AnimalCreate>): Promise<Animal> => {
    const response = await apiClient.put<Animal>(`/animals/${uuid}`, data)
    return response.data
  },

  deleteAnimal: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/animals/${uuid}`)
  },

  // Species
  getSpecies: async (params?: {
    skip?: number
    limit?: number
    search?: string
  }): Promise<Species[]> => {
    const response = await apiClient.get<Species[]>('/species/', { params })
    return response.data
  },

  getSpeciesById: async (uuid: string): Promise<Species> => {
    const response = await apiClient.get<Species>(`/species/${uuid}`)
    return response.data
  },

  createSpecies: async (data: SpeciesCreate): Promise<Species> => {
    const response = await apiClient.post<Species>('/species/', data)
    return response.data
  },

  updateSpecies: async (uuid: string, data: Partial<SpeciesCreate>): Promise<Species> => {
    const response = await apiClient.put<Species>(`/species/${uuid}`, data)
    return response.data
  },

  deleteSpecies: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/species/${uuid}`)
  },

  // Enclosures
  getEnclosures: async (params?: {
    skip?: number
    limit?: number
    search?: string
  }): Promise<Enclosure[]> => {
    const response = await apiClient.get<Enclosure[]>('/enclosures/', { params })
    return response.data
  },

  getEnclosureById: async (uuid: string): Promise<Enclosure> => {
    const response = await apiClient.get<Enclosure>(`/enclosures/${uuid}`)
    return response.data
  },

  createEnclosure: async (data: EnclosureCreate): Promise<Enclosure> => {
    const response = await apiClient.post<Enclosure>('/enclosures/', data)
    return response.data
  },

  updateEnclosure: async (uuid: string, data: Partial<EnclosureCreate>): Promise<Enclosure> => {
    const response = await apiClient.put<Enclosure>(`/enclosures/${uuid}`, data)
    return response.data
  },

  deleteEnclosure: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/enclosures/${uuid}`)
  },
}

