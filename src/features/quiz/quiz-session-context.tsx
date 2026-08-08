import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { QuizAnswer, SubmitQuizResult } from '@/shared/api/types'

const RESULT_STORAGE_KEY = 'quiz-last-result'

type QuizSessionContextValue = {
  answers: QuizAnswer[]
  setAnswer: (questionId: string, alternativeId: string) => void
  getAnswer: (questionId: string) => string | undefined
  clearAnswers: () => void
  result: SubmitQuizResult | null
  setResult: (result: SubmitQuizResult | null) => void
  clearResult: () => void
  resetSession: () => void
}

const QuizSessionContext = createContext<QuizSessionContextValue | null>(null)

function readStoredResult(): SubmitQuizResult | null {
  try {
    const raw = sessionStorage.getItem(RESULT_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SubmitQuizResult
  } catch {
    return null
  }
}

export function QuizSessionProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [result, setResultState] = useState<SubmitQuizResult | null>(() =>
    readStoredResult(),
  )

  const setAnswer = useCallback((questionId: string, alternativeId: string) => {
    setAnswers((prev) => {
      const rest = prev.filter((a) => a.questionId !== questionId)
      return [...rest, { questionId, alternativeId }]
    })
  }, [])

  const getAnswer = useCallback(
    (questionId: string) =>
      answers.find((a) => a.questionId === questionId)?.alternativeId,
    [answers],
  )

  const clearAnswers = useCallback(() => setAnswers([]), [])

  const setResult = useCallback((next: SubmitQuizResult | null) => {
    if (next) {
      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(next))
    } else {
      sessionStorage.removeItem(RESULT_STORAGE_KEY)
    }
    setResultState(next)
  }, [])

  const clearResult = useCallback(() => setResult(null), [setResult])

  const resetSession = useCallback(() => {
    setAnswers([])
    setResult(null)
  }, [setResult])

  const value = useMemo(
    () => ({
      answers,
      setAnswer,
      getAnswer,
      clearAnswers,
      result,
      setResult,
      clearResult,
      resetSession,
    }),
    [
      answers,
      setAnswer,
      getAnswer,
      clearAnswers,
      result,
      setResult,
      clearResult,
      resetSession,
    ],
  )

  return (
    <QuizSessionContext.Provider value={value}>
      {children}
    </QuizSessionContext.Provider>
  )
}

export function useQuizSession() {
  const ctx = useContext(QuizSessionContext)
  if (!ctx) {
    throw new Error('useQuizSession must be used within QuizSessionProvider')
  }
  return ctx
}
