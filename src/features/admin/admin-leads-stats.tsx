import { Users } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import type { LeadStats } from '@/shared/api/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart'
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel'
import { Skeleton } from '@/shared/components/ui/skeleton'

const BAND_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
] as const

const STAGE_COLORS = [
  'var(--chart-1)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

type AdminLeadsStatsProps = {
  stats: LeadStats | undefined
  isLoading: boolean
  isError: boolean
}

function TotalLeadsCard({ total }: { total: number }) {
  return (
    <Card className="gap-0 py-4 shadow-sm">
      <CardContent className="flex items-center justify-between gap-4 px-5">
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-muted-foreground">
            Total de leads
          </p>
          <p className="text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">
            {total}
          </p>
          <p className="text-xs text-muted-foreground">
            Cadastros no quiz · calculado no backend
          </p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Users className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function BandPieCard({
  pieData,
  pieConfig,
}: {
  pieData: Array<{
    band: string
    label: string
    count: number
    percentage: number
    fill: string
  }>
  pieConfig: ChartConfig
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Distribuição por faixa</CardTitle>
        <CardDescription>Score bands do diagnóstico</CardDescription>
      </CardHeader>
      <CardContent>
        {pieData.every((d) => d.count === 0) ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Sem leads ainda.
          </p>
        ) : (
          <ChartContainer
            config={pieConfig}
            className="mx-auto aspect-square max-h-[260px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => {
                      const payload = item.payload as {
                        percentage?: number
                        label?: string
                      }
                      return (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            {payload.label ?? name}
                          </span>
                          <span className="font-mono font-medium tabular-nums">
                            {String(value)}
                            {payload.percentage != null
                              ? ` (${payload.percentage}%)`
                              : ''}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="band"
                innerRadius={48}
                strokeWidth={3}
              />
              <ChartLegend content={<ChartLegendContent nameKey="band" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

function StudyStageBarCard({
  barData,
  barConfig,
  firstQuestionTitle,
}: {
  barData: Array<{
    key: string
    label: string
    count: number
    fill: string
  }>
  barConfig: ChartConfig
  firstQuestionTitle: string | null
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Etapa dos estudos</CardTitle>
        <CardDescription>
          {firstQuestionTitle ?? 'Baseado na primeira pergunta do quiz'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {barData.every((d) => d.count === 0) ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Sem respostas de etapa ainda.
          </p>
        ) : (
          <ChartContainer
            config={barConfig}
            className="aspect-[4/3] w-full max-h-[280px]"
          >
            <BarChart
              accessibilityLayer
              data={barData}
              margin={{ top: 24, left: 8, right: 8, bottom: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 10 }}
                height={48}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" radius={8}>
                <LabelList
                  dataKey="count"
                  position="top"
                  offset={8}
                  className="fill-foreground text-xs font-semibold"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

const registrationConfig = {
  count: {
    label: 'Cadastros no dia',
    color: 'var(--chart-1)',
  },
  cumulative: {
    label: 'Acumulado',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

function RegistrationsAreaCard({
  data,
}: {
  data: LeadStats['registrationsOverTime']
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Fluxo de cadastros</CardTitle>
        <CardDescription>
          Cadastros por dia e volume acumulado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Sem cadastros ainda.
          </p>
        ) : (
          <ChartContainer
            config={registrationConfig}
            className="aspect-[16/9] w-full max-h-[280px]"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 12, left: 8, right: 12, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                fill="var(--color-count)"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="var(--color-cumulative)"
                fill="var(--color-cumulative)"
                fillOpacity={0.12}
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function AdminLeadsStats({
  stats,
  isLoading,
  isError,
}: AdminLeadsStatsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="hidden gap-4 md:grid md:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl max-md:hidden" />
        <Skeleton className="h-80 rounded-2xl md:hidden" />
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-destructive">
          Não foi possível carregar as métricas do dashboard.
        </CardContent>
      </Card>
    )
  }

  const pieData = stats.byScoreBand.map((item, index) => ({
    band: item.band,
    label: item.label,
    count: item.count,
    percentage: item.percentage,
    fill: BAND_COLORS[index % BAND_COLORS.length],
  }))

  const pieConfig = Object.fromEntries(
    pieData.map((item) => [
      item.band,
      { label: item.label, color: item.fill },
    ]),
  ) satisfies ChartConfig

  const barData = stats.byStudyStage.map((item, index) => ({
    key: item.key,
    label: item.label,
    count: item.count,
    fill: STAGE_COLORS[index % STAGE_COLORS.length],
  }))

  const barConfig = {
    count: { label: 'Leads', color: 'var(--chart-1)' },
    ...Object.fromEntries(
      barData.map((item) => [
        item.key,
        { label: item.label, color: item.fill },
      ]),
    ),
  } satisfies ChartConfig

  const registrations = stats.registrationsOverTime ?? []

  const pieCard = <BandPieCard pieData={pieData} pieConfig={pieConfig} />
  const barCard = (
    <StudyStageBarCard
      barData={barData}
      barConfig={barConfig}
      firstQuestionTitle={stats.firstQuestionTitle}
    />
  )
  const areaCard = <RegistrationsAreaCard data={registrations} />

  return (
    <div className="space-y-4">
      <TotalLeadsCard total={stats.totalLeads} />

      {/* Desktop / tablet */}
      <div className="hidden gap-4 md:grid md:grid-cols-2 md:items-stretch">
        {pieCard}
        {barCard}
      </div>
      <div className="hidden md:block">{areaCard}</div>

      {/* Mobile carousel: all charts */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem className="basis-full pl-0">{pieCard}</CarouselItem>
            <CarouselItem className="basis-full pl-0">{barCard}</CarouselItem>
            <CarouselItem className="basis-full pl-0">{areaCard}</CarouselItem>
          </CarouselContent>
          <div className="mt-3 flex items-center justify-between gap-2">
            <CarouselPrevious />
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <CarouselDots />
              <CarouselCounter />
            </div>
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
