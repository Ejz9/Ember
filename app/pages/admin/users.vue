<script setup lang="ts">
</script>

<template>
  <UDashboardPanel id="users">
    <template #header>
      <UDashboardNavbar title="Users">
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
      <AdminUsersTable />
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>