import { useMutation, useQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/auth'
import {
  exportLeadsCsv,
  fetchLeadById,
  fetchLeadStats,
  fetchLeads,
  fetchScoreBands,
} from '@/shared/api'
import type { LeadSummary, ScoreBand } from '@/shared/api/types'
import { AdminLeadsStats } from './admin-leads-stats'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'

const PAGE_SIZE = 10

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

function LeadRowActions({
  lead,
  onOpen,
}: {
  lead: LeadSummary
  onOpen: (id: string) => void
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="size-9 shrink-0"
      aria-label={`Detalhes de ${lead.name}`}
      onClick={() => onOpen(lead.id)}
    >
      <MoreHorizontal className="size-4" />
    </Button>
  )
}

export function AdminLeadsPage() {
  const { user } = useAuth()
  const token = user?.token ?? ''

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [band, setBand] = useState<'' | ScoreBand>('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const bandsQuery = useQuery({
    queryKey: ['score-bands'],
    queryFn: fetchScoreBands,
  })

  const statsQuery = useQuery({
    queryKey: ['lead-stats'],
    queryFn: () => fetchLeadStats(token),
    enabled: Boolean(token),
  })

  const leadsQuery = useQuery({
    queryKey: ['leads', search, band, page],
    queryFn: () =>
      fetchLeads({ search, band, page, limit: PAGE_SIZE }, token),
    enabled: Boolean(token),
  })

  const detailQuery = useQuery({
    queryKey: ['lead', selectedId],
    queryFn: () => fetchLeadById(selectedId!, token),
    enabled: Boolean(token && selectedId),
  })

  const exportMutation = useMutation({
    mutationFn: (filters: { search: string; band: '' | ScoreBand }) =>
      exportLeadsCsv(
        {
          search: filters.search,
          band: filters.band,
        },
        token,
      ),
    onMutate: () => setExportError(null),
    onError: (err) => {
      setExportError(
        err instanceof Error ? err.message : 'Falha ao exportar CSV',
      )
    },
  })

  const leads = leadsQuery.data?.data ?? []
  const meta = leadsQuery.data?.meta

  useEffect(() => {
    if (!meta) return
    if (meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages)
    }
  }, [meta, page])

  const emptyMessage = useMemo(() => {
    if (leadsQuery.isLoading) return null
    if (leadsQuery.isError) return 'Erro ao carregar leads.'
    if (leads.length === 0) return 'Nenhum lead encontrado.'
    return null
  }, [leadsQuery.isLoading, leadsQuery.isError, leads.length])

  function applyFilters() {
    setPage(1)
    setSearch(searchInput.trim())
  }

  /**
   * Export ALL leads matching active filters (not only the current page).
   * Applies pending search field so the CSV matches what the user typed.
   */
  function handleExportCsv() {
    const nextSearch = searchInput.trim()
    if (nextSearch !== search) {
      setSearch(nextSearch)
      setPage(1)
    }
    exportMutation.mutate({ search: nextSearch, band })
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Leads
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Leads capturados pelo quiz diagnóstico.
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex w-full sm:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full shrink-0 gap-2 sm:w-auto"
                  disabled={
                    !token || exportMutation.isPending || meta?.total === 0
                  }
                  onClick={handleExportCsv}
                >
                  <Download className="size-4" />
                  {exportMutation.isPending ? 'Exportando…' : 'Exportar CSV'}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[16rem]">
              Exporta todos os leads dos filtros atuais (não só a página).
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {exportError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {exportError}
        </p>
      )}

      <AdminLeadsStats
        stats={statsQuery.data}
        isLoading={statsQuery.isLoading}
        isError={statsQuery.isError}
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 space-y-0 px-4 sm:px-6">
          <div className="space-y-1">
            <CardTitle className="text-base">Lista de leads</CardTitle>
            <CardDescription className="text-pretty">
              Filtros ativos em todas as páginas · {PAGE_SIZE} por página. O
              CSV exporta a tabela completa do filtro.
            </CardDescription>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyFilters()
              }}
              placeholder="Buscar por nome ou e-mail"
              className="w-full"
            />
            <select
              value={band}
              onChange={(e) => {
                setBand(e.target.value as '' | ScoreBand)
                setPage(1)
              }}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm sm:w-48"
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
              className="w-full sm:w-auto"
              onClick={applyFilters}
            >
              Buscar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6">
          {/* Loading */}
          {leadsQuery.isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl sm:h-10" />
              ))}
            </div>
          )}

          {emptyMessage && (
            <p className="rounded-xl border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          )}

          {/* Mobile cards */}
          {!leadsQuery.isLoading && leads.length > 0 && (
            <ul className="space-y-2 md:hidden">
              {leads.map((lead) => (
                <li
                  key={lead.id}
                  className="rounded-xl border border-border/70 bg-card p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-semibold">{lead.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {lead.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lead.phone}
                      </p>
                    </div>
                    <LeadRowActions
                      lead={lead}
                      onOpen={setSelectedId}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
                    <Badge variant="secondary" className="tabular-nums">
                      {lead.score} pts
                    </Badge>
                    <Badge variant="outline" className="max-w-full truncate">
                      {lead.scoreBandLabel}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Desktop table */}
          {!leadsQuery.isLoading && leads.length > 0 && (
            <div className="hidden overflow-x-auto rounded-lg border md:block">
              <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
                <colgroup>
                  <col className="w-[18%]" />
                  <col className="w-[24%]" />
                  <col className="w-[16%]" />
                  <col className="w-[10%]" />
                  <col className="w-[22%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium">Nome</th>
                    <th className="px-3 py-2.5 font-medium">E-mail</th>
                    <th className="px-3 py-2.5 font-medium">Telefone</th>
                    <th className="px-3 py-2.5 font-medium">Pontos</th>
                    <th className="px-3 py-2.5 font-medium">Faixa</th>
                    <th className="px-3 py-2.5 text-right font-medium">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b last:border-b-0 hover:bg-muted/20"
                    >
                      <td className="truncate px-3 py-3 font-medium">
                        {lead.name}
                      </td>
                      <td className="truncate px-3 py-3 text-muted-foreground">
                        {lead.email}
                      </td>
                      <td className="truncate px-3 py-3 text-muted-foreground">
                        {lead.phone}
                      </td>
                      <td className="px-3 py-3 tabular-nums">{lead.score}</td>
                      <td className="px-3 py-3">
                        <Badge
                          variant="outline"
                          className="max-w-full truncate font-normal"
                        >
                          {lead.scoreBandLabel}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <LeadRowActions
                          lead={lead}
                          onOpen={setSelectedId}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta && meta.total > 0 && (
            <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-center text-sm text-muted-foreground sm:text-left">
                <span className="font-medium text-foreground">{meta.total}</span>{' '}
                lead{meta.total === 1 ? '' : 's'} no filtro · página{' '}
                {meta.page}/{meta.totalPages}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={!meta.hasPreviousPage || leadsQuery.isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={!meta.hasNextPage || leadsQuery.isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet
        open={Boolean(selectedId)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader className="text-center sm:text-center">
            <SheetTitle>Detalhe do lead</SheetTitle>
            <SheetDescription>
              Respostas e pontuação do diagnóstico.
            </SheetDescription>
          </SheetHeader>

          {detailQuery.isLoading && (
            <div className="mt-4 space-y-2 px-1">
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
            <div className="my-2 space-y-6 px-1 text-sm">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="space-y-1">
                  <p className="text-lg font-semibold break-words">
                    {detailQuery.data.name}
                  </p>
                  <p className="break-all text-muted-foreground">
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
              <ul className="mx-0 space-y-3 text-left sm:mx-1">
                {detailQuery.data.answers.map((answer) => (
                  <li
                    key={answer.id}
                    className="rounded-lg border border-border/60 p-3"
                  >
                    <p className="font-medium text-pretty">
                      {answer.questionText ?? answer.question.title}
                    </p>
                    <p className="mt-1 text-muted-foreground text-pretty">
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
