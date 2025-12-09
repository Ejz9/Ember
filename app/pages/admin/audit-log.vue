<script setup lang="ts">

</script>

<template>
  <UDashboardPanel>
    <UDashboardPanel id="home">
      <template #header>
        <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <AdminRecentChanges />
      </template>
    </UDashboardPanel>
  </UDashboardPanel>
</template>

<style scoped>

</style>