import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'

export function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Leads capturados pelo quiz. Integração com API em seguida.
        </p>
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-base">Filtros</CardTitle>
            <CardDescription>Busca por nome/e-mail e faixa</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Input placeholder="Buscar por nome ou e-mail" className="sm:w-64" />
            <Input placeholder="Faixa (placeholder)" className="sm:w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-[1.2fr_1.4fr_1fr_0.7fr_0.9fr_auto] gap-2 border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
              <span>Nome</span>
              <span>E-mail</span>
              <span>Telefone</span>
              <span>Pontos</span>
              <span>Faixa</span>
              <span />
            </div>
            <div className="grid grid-cols-[1.2fr_1.4fr_1fr_0.7fr_0.9fr_auto] items-center gap-2 px-3 py-3 text-sm">
              <span className="truncate text-muted-foreground">—</span>
              <span className="truncate text-muted-foreground">—</span>
              <span className="truncate text-muted-foreground">—</span>
              <span className="text-muted-foreground">—</span>
              <Badge variant="outline">—</Badge>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost">
                    Detalhe
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Detalhe do lead</SheetTitle>
                    <SheetDescription>
                      Respostas e pontuação serão listadas aqui.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
