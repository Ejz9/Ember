<script setup lang="ts">
import { authClient } from "@/lib/auth-client"
import SnippetCard from "@/components/SnippetCard.vue";
import type {Snippet} from "#shared/snippet-schema";
import {filteredSnippets} from "~/utils/snippet-handling";

const session = authClient.useSession();

const { data: snippetsData, pending } = await useFetch<Snippet[]>(
    () => `/api/snippets/public`
);

const query = ref('');

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

    <div v-if="pending">
      Loading...
    </div>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
      <SnippetCard
          v-for="snippet in snippets"
          :key="snippet._id"
          :snippet="snippet"
      />
    </div>
  </UContainer>
</template>

<style scoped>
</style>
