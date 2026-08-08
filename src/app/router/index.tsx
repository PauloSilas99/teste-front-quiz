import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/app/layouts/admin-layout'
import { PublicLayout } from '@/app/layouts/public-layout'
import { AdminLeadsPage } from '@/features/admin'
import { LoginPage, PrivateRoute } from '@/features/auth'
import { LeadCapturePage } from '@/features/lead'
import { QuizHomePage, QuizPage, QuizResultPage } from '@/features/quiz'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<QuizHomePage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="captura" element={<LeadCapturePage />} />
        <Route path="resultado" element={<QuizResultPage />} />
      </Route>

      <Route path="admin/login" element={<LoginPage />} />

      <Route path="admin" element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="leads" replace />} />
          <Route path="leads" element={<AdminLeadsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
