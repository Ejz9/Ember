<script setup lang="ts">
import { eachDayOfInterval, format, startOfDay } from 'date-fns'
import { VisXYContainer, VisLine, VisAxis, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue'
import type { Period, Range } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

type DataRecord = {
  date: Date
  amount: number
}

const { data: activity, pending } = useFetch('/api/admin/activity', {
  lazy: true,
  server: false,
})

const data = ref<DataRecord[]>([])

watch([() => activity.value, () => props.period, () => props.range], () => {
  if (!activity.value) {
    return
  }

  const dailyTotals = new Map<number, number>()

  for (const stat of activity.value) {
    const day = startOfDay(new Date(stat.createdAt)).getTime()
    dailyTotals.set(day, (dailyTotals.get(day) || 0) + 1)
  }

  const dates = eachDayOfInterval(props.range)

  data.value = dates.map(date => {
    const day = startOfDay(date).getTime()
    return { date, amount: dailyTotals.get(day) || 0 }
  })
}, { immediate: true })

const x = (_: DataRecord, i: number) => i
const y = (d: DataRecord) => d.amount

const total = computed(() => data.value.reduce((acc: number, { amount }) => acc + amount, 0))

const formatNumber = new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format

const formatDate = (date: Date): string => {
  return format(date, 'd MMM')
}

const xTicks = (i: number) => {
  if (i === 0 || i === data.value.length - 1 || !data.value[i]) {
    return ''
  }
  return formatDate(data.value[i].date)
}

const template = (d: DataRecord) => `${formatDate(d.date)}: ${formatNumber(d.amount)}`
</script>

<template>
  <UCard :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          Snippets
        </p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ total }}
        </p>
      </div>
    </template>

    <VisXYContainer
        :data="data"
        :padding="{ top: 40 }"
        class="h-96"
    >
      <VisLine
          :x="x"
          :y="y"
          color="var(--ui-primary)"
      />
      <VisArea
          :x="x"
          :y="y"
          color="var(--ui-primary)"
          :opacity="0.1"
      />

      <VisAxis
          type="x"
          :x="x"
          :tick-format="xTicks"
      />

      <VisCrosshair
          color="var(--ui-primary)"
          :template="template"
      />

      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
