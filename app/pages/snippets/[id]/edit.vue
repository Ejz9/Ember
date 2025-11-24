<script setup lang="ts">
definePageMeta({
  middleware: ['snippet-author']
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const { data: snippet, pending, error } = await useFetch(`/api/snippets/${id}`, {
  key: `snippet-${id}`
});

console.log(error)

const toast = useToast();

async function handleSubmit(data: any) {
  try {
    await $fetch(`/api/snippets/${id}`, {
      method: 'POST',
      body: data
    });
    toast.add({ title: 'Success', description: 'Snippet updated successfully.', color: 'green' });
    // Invalidate the cache for the snippet to ensure fresh data is loaded on the next view.
    await refreshNuxtData(`snippet-${id}`);
    await router.push(`/snippets/${id}`);
  } catch (e) {
    toast.add({ title: 'Error', description: 'Failed to update snippet.', color: 'red' });
  }
}
</script>

<template>
  <UContainer>
    <SnippetForm :initial-data="snippet" @submit="handleSubmit" class="my-8"/>
  </UContainer>
</template>

<style scoped>
</style>