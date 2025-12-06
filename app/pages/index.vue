<script setup lang="ts">
import { authClient } from "@/lib/auth-client"
import type { Snippet } from "#shared/snippet-schema";
import { filteredSnippets } from "~/utils/snippet-handling";

const session = authClient.useSession();
const query = ref('');

const { data: snippetsData, pending } = useAsyncData<Snippet[]>('public-snippets', () => $fetch(`/api/snippets/public`), {
  lazy: true,
  default: () => []
});

const snippets = computed(() => filteredSnippets(snippetsData.value, query.value));
</script>

<template>
  <UContainer>
    <div class="flex justify-between items-center">
      <UInput
          v-model="query"
          icon="i-lucide-search"
          size="xl"
          placeholder="Search"
          class="my-8"
      />
      <UButton v-if="session.data" loading-auto to="/snippets/new" size="xl" icon="i-lucide-plus" color="primary" variant="solid"/>
    </div>

    <!-- Show skeleton cards while data is loading on the client -->
    <div v-if="pending" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
      <!-- Nuxt will automatically render SnippetCard.server.vue here -->
      <SnippetCard />
    </div>

    <!-- Once data is loaded, show the actual snippet cards -->
    <div v-else-if="snippets.length > 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
      <!-- Nuxt will hydrate with SnippetCard.client.vue here, passing the snippet prop -->
      <SnippetCard v-for="snippet in snippets" :key="snippet._id" :snippet="snippet" />
    </div>

    <!-- Optional: You can add a message for when there are no results -->
  </UContainer>
</template>

<style scoped>
</style>
