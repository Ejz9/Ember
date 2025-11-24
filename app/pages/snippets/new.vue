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
    await $fetch('/api/snippets', {
      method: 'POST',
      body: formData
    });
    toast.add({ title: 'Success', description: 'Snippet created successfully.', color: 'primary' })
    const user = session.data?.user
    if (user) {
      await router.push(`/user/${user.id}`)
    } else {
      await router.push('/')
    }
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
