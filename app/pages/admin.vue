<script setup lang="ts">
definePageMeta({
  // Apply middleware and layout to all /admin/* routes
  middleware: ['admin-auth'],
  layout: 'admin'
});
</script>

<template>
  <NuxtPage />
</template>