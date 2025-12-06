<script setup lang="ts">
</script>

<template>
  <UDashboardPanel id="users">
    <template #header>
      <UDashboardNavbar title="Users">
        <template #leading>
          <UDashboardSidebarCollapse size="lg" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <AdminUsersTable />
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>