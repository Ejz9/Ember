<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'


const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
</script>

<template>
  <UDashboardPanel id="dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- To change for future use
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
                color="neutral"
                variant="ghost"
                square
                @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>
          -->
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <!--TODO: Implement proper scaling across components for selection -->
          <AdminDateRangePicker v-model="range" class="-ms-1 pointer-events-none text-muted" />

          <AdminPeriodSelect v-model="period" :range="range" class="pointer-events-none text-muted"/>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <AdminApplicationStats />
      <AdminActivityChart :period="period" :range="range " />
      <AdminRecentChanges :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
