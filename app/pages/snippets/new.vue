<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

definePageMeta({
  middleware: ['snippet-author']
});

const session = authClient.useSession()
const toast = useToast()
const router = useRouter()

async function createSnippet(formData) {
  try {
    const newSnippet = await $fetch('/api/snippets', {
      method: 'POST',
      body: formData
    });
    toast.add({ title: 'Success', description: 'Snippet created successfully.', color: 'primary' })
    await router.push(`/snippets/${newSnippet._id}`)
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to create snippet.', color: 'error' })
  }
}
</script>

<template>
  <UContainer>
    <SnippetForm @submit="createSnippet" class="my-8" />
  </UContainer>
</template>

<style scoped>

</style>
