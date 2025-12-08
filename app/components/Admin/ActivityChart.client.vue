<script setup lang="ts">
import { format, startOfDay, endOfDay } from 'date-fns'
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

const queryParams = computed(() => {
  const start = startOfDay(new Date(props.range.start))
  const end = endOfDay(new Date(props.range.end))

  return {
    range: JSON.stringify({
      start: start.toISOString(),
      end: end.toISOString()
    }),
    period: props.period,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
})

const { data: activity, pending } = useFetch<any[]>('/api/admin/activity', {
  query: queryParams,
  lazy: true,
  server: false,
});

const data = computed<DataRecord[]>(() => {
  return activity.value?.map(item => ({ ...item, date: new Date(item.date) })) || []
})

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
