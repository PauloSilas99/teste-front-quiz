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
import { Badge } from '@/shared/components/ui/badge'

export function QuizResultPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <Card>
          <CardHeader className="text-center">
            <CardDescription>Seu diagnóstico</CardDescription>
            <CardTitle className="text-3xl">—</CardTitle>
            <div className="pt-2">
              <Badge variant="secondary">Faixa pendente</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground text-pretty">
              A pontuação e a faixa serão calculadas e retornadas pelo backend.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Fazer novamente</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
