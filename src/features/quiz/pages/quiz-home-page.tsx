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

export function QuizHomePage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-balance">
              Qual é a sua chance real de passar no ENEM?
            </CardTitle>
            <CardDescription className="text-pretty">
              Responda 10 perguntas rápidas e receba um diagnóstico da sua
              preparação.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button asChild size="lg" className="min-w-40">
              <Link to="/quiz">Começar</Link>
            </Button>
            <Link
              to="/admin/login"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Área administrativa
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
