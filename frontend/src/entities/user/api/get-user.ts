import { apiRequest } from '@shared/api'
import type { User } from '../model/types'

export function getUser(id: string, signal?: AbortSignal): Promise<User> {
  return apiRequest<User>(`/users/${id}`, { signal })
}
