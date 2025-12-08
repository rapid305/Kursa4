export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export interface User {
  uuid: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: UserRole
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Зоопарк
export interface Species {
  uuid: string
  name: string
  scientific_name: string
  description: string | null
  habitat: string | null
  diet: string | null
  conservation_status: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Enclosure {
  uuid: string
  name: string
  enclosure_type: string
  area: number | null
  capacity: number | null
  description: string | null
  location: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Animal {
  uuid: string
  name: string
  gender: string
  birth_date: string | null
  arrival_date: string
  health_status: string
  description: string | null
  species_uuid: string
  enclosure_uuid: string | null
  species?: Species
  enclosure?: Enclosure
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AnimalCreate {
  name: string
  gender: string
  birth_date?: string | null
  arrival_date: string
  health_status?: string
  description?: string | null
  species_uuid: string
  enclosure_uuid?: string | null
}

export interface SpeciesCreate {
  name: string
  scientific_name: string
  description?: string | null
  habitat?: string | null
  diet?: string | null
  conservation_status?: string | null
}

export interface EnclosureCreate {
  name: string
  enclosure_type: string
  area?: number | null
  capacity?: number | null
  description?: string | null
  location?: string | null
}
