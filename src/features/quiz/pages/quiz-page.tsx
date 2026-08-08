import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function QuizPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-xl"
      >
        <Card>
          <CardHeader>
            <CardDescription>Pergunta 1 de 10</CardDescription>
            <CardTitle className="text-xl text-balance">
              Quiz em construção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              As perguntas serão carregadas da API com TanStack Query.
            </p>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-between gap-2 pt-2">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button asChild>
                <Link to="/captura">Continuar (placeholder)</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
