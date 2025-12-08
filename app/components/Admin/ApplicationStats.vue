<script setup lang="ts">
import type { Period, Range } from '~/types'
import type { StatElement } from '#shared/stat-schema'
import {endOfDay, startOfDay} from "date-fns";

const props = defineProps<{
  period: Period
  range: Range
}>()

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
 
const { data: stats, pending, error } = useFetch<StatElement[]>(`/api/admin/stats`, {
  query: queryParams,
  lazy: true,
  server: false,
});
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
        v-for="(stat, index) in stats"
        :key="index"
        :icon="stat.icon"
        :title="stat.title"
        variant="subtle"
        :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase'
      }"
        class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>

        <UBadge
            :color="stat.variation > 0 ? 'green' : stat.variation < 0 ? 'red' : 'gray'"
            variant="subtle"
            class="text-xs"
        >
          {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
        </UBadge>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
