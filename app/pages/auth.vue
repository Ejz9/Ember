<script setup lang="ts">
import { authClient } from "@/lib/auth-client"
const session = authClient.useSession();

const toast = useToast()

const signOut = [
  {
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    onClick: () => {
      authClient.signOut();
    }
  }
]

const providers = [
  {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
    onClick: () => {
      authClient.signIn.social({ provider: 'github' })
      toast.add({ title: 'GitHub', description: 'Login with GitHub' })
    }
  }
]

const imageError = ref(false)
const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <UContainer>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <UPageCard class="w-full max-w-md">
        <UAuthForm
            v-if="!session?.data"
            :providers="providers"
            title="Welcome back!"
            icon="i-lucide-lock"
        >
          <template #description>
            Sign in with your provider.
          </template>
          <template #validation>
            <UAlert color="error" icon="i-lucide-info" title="Error signing in" />
          </template>
          <template #footer>
            built with <ULink to="https://www.better-auth.com/" class="text-primary font-medium">better-auth.</ULink>
          </template>
        </UAuthForm>
        <UAuthForm
            v-if="session?.data"
            :providers="signOut"
            title="Signed in as"
            icon="i-lucide-lock-open"
        >
          <template #description>
            <UAvatar
                v-if="session.data.user.image && !imageError"
                :src="session.data.user.image"
                alt="User Avatar"
                size="md"
                @error="handleImageError"
            />
            <AvatarFallback
                v-else
                :value="session.data.user.id"
                :alt="session.data.user.email"
                size="md"
            />
            <div>
              {{ session.data.user.email }}
            </div>
          </template>
          <template #footer>
            built with <ULink to="https://www.better-auth.com/" class="text-primary font-medium">better-auth.</ULink>
          </template>
        </UAuthForm>
      </UPageCard>
    </div>
  </UContainer>
</template>

<style scoped>

</style>