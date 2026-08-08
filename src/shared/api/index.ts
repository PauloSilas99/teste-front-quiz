import { apiClient } from '@/shared/lib/api-client'
import type {
  LeadDetail,
  LeadSummary,
  ListLeadsParams,
  LoginResponse,
  Question,
  ScoreBandConfig,
  SubmitQuizPayload,
  SubmitQuizResult,
} from './types'

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

export function fetchLeads(params: ListLeadsParams, token: string) {
  const query = new URLSearchParams()
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.band) query.set('band', params.band)
  const qs = query.toString()
  return apiClient<LeadSummary[]>(`/leads${qs ? `?${qs}` : ''}`, { token })
}

export function fetchLeadById(id: string, token: string) {
  return apiClient<LeadDetail>(`/leads/${id}`, { token })
}
