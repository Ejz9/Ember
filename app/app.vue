<template>
  <UApp>
    <UHeader>
      <template #title>
        <UIcon name="i-lucide-lightbulb" class="size-5"/>
      </template>

      <!-- Nav Menu If Needed
      <template #left>
        <UNavigationMenu :items="items"/>
      </template>
      -->

      <template #right>
        <UColorModeButton />

        <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
          <UButton
              color="neutral"
              variant="ghost"
              to="https://github.com/Ejz9/Ember"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
          />
        </UTooltip>
        <UserProfile :user="session.data?.user" />
      </template>
    </UHeader>
    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />
  </UApp>
</template>
<script setup lang="ts">
import { authClient } from '@/lib/auth-client';

const session = authClient.useSession()

const items = ref([
  { label: 'Home', icon: 'i-lucide-file-text', to: '/' },
])
</script>