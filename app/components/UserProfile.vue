<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

const props = defineProps({
  user: {
   type: Object,
  }
});

const imageError = ref(false)
const handleImageError = () => {
  imageError.value = true
}

// Reset error state if user or image source changes
watch(() => props.user, () => {
  imageError.value = false
}, { deep: true })

const router = useRouter()

const goSnippets = async () => {
  const user = props.user
  if (user) {
    await router.push(`/user/${user.id}`)
  }
}

const signOut = async () => {
  await authClient.signOut()
  await router.push('/')
}
</script>

<template>
  <div>
    <UPopover v-if="user">
      <UButton variant="ghost" class="rounded-full">
        <UAvatar
            v-if="user.image && !imageError"
            :src="user.image"
            alt="User Avatar"
            size="md"
            @error="handleImageError"
        />
        <AvatarFallback
            v-else
            :value="user.id"
            :alt="user.email"
            size="md"
        />
      </UButton>

      <template #content>
        <div class="p-4">
          <div class="text-sm">
            <p>Signed in as</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ user.email }}
            </p>
          </div>
          <USeparator class="my-2" />
          <UButton
              label="Snippets"
              color="primary"
              variant="ghost"
              @click="goSnippets"
              icon="i-lucide-archive"
          />
          <UButton
              label="Sign out"
              color="error"
              variant="ghost"
              @click="signOut"
              icon="i-lucide-log-out"
          />
        </div>
      </template>
    </UPopover>
    <UButton
        v-else
        label="Sign in"
        to="/auth"
        color="gray"
        icon="i-lucide-log-in"
    />
  </div>
</template>
