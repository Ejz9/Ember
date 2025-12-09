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
          <AdminDateRangePicker v-model="range" class="-ms-1" />

          <AdminPeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <AdminApplicationStats :period="period" :range="range" />
      <AdminActivityChart :period="period" :range="range " />
      <AdminRecentChanges :limit="5" :enableScroll="false" />
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
