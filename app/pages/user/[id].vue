<script setup lang="ts">
import SnippetCard from "@/components/SnippetCard.vue";
import type {Snippet} from "#shared/snippet-schema";
import {filteredSnippets} from "@/utils/snippet-handling";

definePageMeta({
  middleware: ['snippet-author']
});

const route = useRoute();

const { data: snippetsData, pending } = await useFetch<Snippet[]>(
    () => `/api/snippets/user-snippets/${route.params.id}`
);

const query = ref('');

const snippets = computed(() => filteredSnippets(snippetsData.value, query.value));
</script>

<template>
  <UContainer>
    <UInput
        v-model="query"
        icon="i-lucide-search"
        size="xl"
        placeholder="Search"
        class="my-8"
    />

    <div v-if="pending">
      Loading...
    </div>
    <div v-else-if="snippets && snippets.length > 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
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