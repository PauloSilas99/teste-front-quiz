export type ScoreBand =
  | 'STARTING'
  | 'BUILDING'
  | 'ON_TRACK'
  | 'FINAL_STRETCH'

export type QuestionAlternative = {
  id: string
  label: string
  position: number
}

export type Question = {
  id: string
  title: string
  position: number
  alternatives: QuestionAlternative[]
}

export type QuizAnswer = {
  questionId: string
  alternativeId: string
}

export type SubmitQuizPayload = {
  name: string
  email: string
  phone: string
  answers: QuizAnswer[]
}

export type LeadAnswer = {
  id: string
  leadId: string
  questionId: string
  alternativeId: string
  weightAtTime: number
  questionText: string | null
  alternativeText: string | null
}

export type SubmitQuizResult = {
  leadId: string
  score: number
  scoreBand: ScoreBand
  /** Label humano da faixa (score_band_configs.label) */
  bandLabel: string
  /** Alias de bandLabel (mesma origem do banco) */
  scoreBandLabel?: string
  message: string
  answers: LeadAnswer[]
}

export type ScoreBandConfig = {
  band: ScoreBand
  label: string
  message: string
  minScore: number
  maxScore: number
}

export type LoginResponse = {
  accessToken: string
  user: { id: string; email: string }
}

export type LeadSummary = {
  id: string
  name: string
  email: string
  phone: string
  score: number
  scoreBand: ScoreBand
  /** Label humano da faixa (score_band_configs.label) */
  scoreBandLabel: string
  createdAt: string
}

export type LeadDetail = LeadSummary & {
  scoreBandMessage?: string | null
  answers: Array<
    LeadAnswer & {
      question: { title: string; position: number }
      alternative: { label: string; weight: number }
    }
  >
}

export type ListLeadsParams = {
  search?: string
  band?: ScoreBand | ''
  page?: number
  limit?: number
}

export type LeadsPageMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type LeadsPageResponse = {
  data: LeadSummary[]
  meta: LeadsPageMeta
}

export type LeadStatsScoreBand = {
  band: ScoreBand
  label: string
  count: number
  percentage: number
}

export type LeadStatsStudyStage = {
  key: string
  label: string
  count: number
}

export type LeadStatsRegistrationPoint = {
  date: string
  label: string
  count: number
  cumulative: number
}

export type LeadStats = {
  totalLeads: number
  firstQuestionTitle: string | null
  byScoreBand: LeadStatsScoreBand[]
  byStudyStage: LeadStatsStudyStage[]
  registrationsOverTime: LeadStatsRegistrationPoint[]
}
