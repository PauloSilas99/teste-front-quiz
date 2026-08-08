import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth'
import { fetchLeadById, fetchLeads, fetchScoreBands } from '@/shared/api'
import type { ScoreBand } from '@/shared/api/types'
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
} from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function AdminLeadsPage() {
  const { user } = useAuth()
  const token = user?.token ?? ''

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [band, setBand] = useState<'' | ScoreBand>('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const bandsQuery = useQuery({
    queryKey: ['score-bands'],
    queryFn: fetchScoreBands,
  })

  const leadsQuery = useQuery({
    queryKey: ['leads', search, band],
    queryFn: () => fetchLeads({ search, band }, token),
    enabled: Boolean(token),
  })

  const detailQuery = useQuery({
    queryKey: ['lead', selectedId],
    queryFn: () => fetchLeadById(selectedId!, token),
    enabled: Boolean(token && selectedId),
  })

  const leads = leadsQuery.data ?? []

  const emptyMessage = useMemo(() => {
    if (leadsQuery.isLoading) return null
    if (leadsQuery.isError) return 'Erro ao carregar leads.'
    if (leads.length === 0) return 'Nenhum lead encontrado.'
    return null
  }, [leadsQuery.isLoading, leadsQuery.isError, leads.length])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Leads capturados pelo quiz diagnóstico.
        </p>
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-base">Filtros</CardTitle>
            <CardDescription>Busca por nome/e-mail e faixa</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSearch(searchInput.trim())
              }}
              placeholder="Buscar por nome ou e-mail"
              className="sm:w-64"
            />
            <select
              value={band}
              onChange={(e) => setBand(e.target.value as '' | ScoreBand)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm sm:w-52"
            >
              <option value="">Todas as faixas</option>
              {(bandsQuery.data ?? []).map((opt) => (
                <option key={opt.band} value={opt.band}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSearch(searchInput.trim())}
            >
              Buscar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <div className="grid min-w-[720px] grid-cols-[1.2fr_1.4fr_1fr_0.7fr_0.9fr_auto] gap-2 border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
              <span>Nome</span>
              <span>E-mail</span>
              <span>Telefone</span>
              <span>Pontos</span>
              <span>Faixa</span>
              <span />
            </div>

            {leadsQuery.isLoading && (
              <div className="space-y-2 p-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {emptyMessage && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            )}

            {leads.map((lead) => (
              <div
                key={lead.id}
                className="grid min-w-[720px] grid-cols-[1.2fr_1.4fr_1fr_0.7fr_0.9fr_auto] items-center gap-2 border-b px-3 py-3 text-sm last:border-b-0"
              >
                <span className="truncate font-medium">{lead.name}</span>
                <span className="truncate text-muted-foreground">
                  {lead.email}
                </span>
                <span className="truncate text-muted-foreground">
                  {lead.phone}
                </span>
                <span className="tabular-nums">{lead.score}</span>
                <Badge variant="outline" className="max-w-[9rem] truncate">
                  {lead.scoreBandLabel}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedId(lead.id)}
                >
                  Detalhe
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Sheet
        open={Boolean(selectedId)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
      >
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader className="text-center sm:text-center">
            <SheetTitle>Detalhe do lead</SheetTitle>
            <SheetDescription>
              Respostas e pontuação do diagnóstico.
            </SheetDescription>
          </SheetHeader>

          {detailQuery.isLoading && (
            <div className="mt-6 space-y-2">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {detailQuery.isError && (
            <p className="mt-6 text-sm text-destructive">
              Não foi possível carregar o lead.
            </p>
          )}

          {detailQuery.data && (
            <div className="mt-6 space-y-6 text-sm">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="space-y-1">
                  <p className="text-lg font-semibold">
                    {detailQuery.data.name}
                  </p>
                  <p className="text-muted-foreground">
                    {detailQuery.data.email}
                  </p>
                  <p className="text-muted-foreground">
                    {detailQuery.data.phone}
                  </p>
                  <p className="text-muted-foreground">
                    {formatDate(detailQuery.data.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Badge>{detailQuery.data.score} pts</Badge>
                  <Badge variant="outline">
                    {detailQuery.data.scoreBandLabel}
                  </Badge>
                </div>
                {detailQuery.data.scoreBandMessage && (
                  <p className="max-w-sm text-balance text-muted-foreground">
                    {detailQuery.data.scoreBandMessage}
                  </p>
                )}
              </div>
              <ul className="space-y-3 text-left">
                {detailQuery.data.answers.map((answer) => (
                  <li
                    key={answer.id}
                    className="rounded-lg border border-border/60 p-3"
                  >
                    <p className="font-medium">
                      {answer.questionText ?? answer.question.title}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {answer.alternativeText ?? answer.alternative.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
