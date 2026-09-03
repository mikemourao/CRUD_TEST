export interface User {
  id: string
  name: string
  email: string
  registration: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedUsers {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetUsersParams {
  search?: string
  page: number
  limit: number
  signal?: AbortSignal
}

export interface CreateUserPayload {
  name: string
  email: string
  registration: string
  password: string
}

export type UpdateUserPayload = Partial<CreateUserPayload>
