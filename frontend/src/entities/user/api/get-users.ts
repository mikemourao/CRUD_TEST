import { apiRequest } from '@shared/api'
import type { GetUsersParams, PaginatedUsers } from '../model/types'

export function getUsers({ search, page, limit, signal }: GetUsersParams): Promise<PaginatedUsers> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) query.set('search', search)

  return apiRequest<PaginatedUsers>(`/users?${query.toString()}`, { signal })
}
