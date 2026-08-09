import { apiClient } from '@/shared/lib/api-client'
import type {
  LeadDetail,
  LeadStats,
  LeadsPageResponse,
  ListLeadsParams,
  LoginResponse,
  Question,
  ScoreBandConfig,
  SubmitQuizPayload,
  SubmitQuizResult,
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export function fetchQuestions() {
  return apiClient<Question[]>('/questions')
}

export function fetchScoreBands() {
  return apiClient<ScoreBandConfig[]>('/score-bands')
}

export function submitQuiz(payload: SubmitQuizPayload) {
  return apiClient<SubmitQuizResult>('/quiz/submit', {
    method: 'POST',
    body: payload,
  })
}

export function loginAdmin(email: string, password: string) {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

function leadsQueryString(params: ListLeadsParams) {
  const query = new URLSearchParams()
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.band) query.set('band', params.band)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  return qs ? `?${qs}` : ''
}

export function fetchLeads(params: ListLeadsParams, token: string) {
  return apiClient<LeadsPageResponse>(`/leads${leadsQueryString(params)}`, {
    token,
  })
}

export function fetchLeadById(id: string, token: string) {
  return apiClient<LeadDetail>(`/leads/${id}`, { token })
}

export function fetchLeadStats(token: string) {
  return apiClient<LeadStats>('/leads/stats', { token })
}

/** Downloads filtered leads as CSV from the backend. */
export async function exportLeadsCsv(
  params: ListLeadsParams,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/leads/export${leadsQueryString({
      search: params.search,
      band: params.band,
    })}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText)
    throw new Error(text || `HTTP ${response.status}`)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'leads.csv'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
