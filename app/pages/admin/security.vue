<script setup lang="ts">

definePageMeta({
  layout: 'admin'
})

</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>

        </template>
      </UDashboardToolbar>
    </template>

    <template #body>

    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>