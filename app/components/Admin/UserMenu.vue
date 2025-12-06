<script setup lang="ts">
import {authClient} from "~/lib/auth-client";

const session = authClient.useSession()

defineProps<{
  collapsed?: boolean
}>()

const imageError = ref(false)
const handleImageError = () => {
  imageError.value = true
}

//const colorMode = useColorMode()
//const appConfig = useAppConfig()

//const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
//const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']

const signOut = useSignOut()

const items = computed<DropdownMenuItem[][]>(() => ([[{
  label: 'Profile',
  icon: 'i-lucide-user',
  to: `/user/${session.data?.user._id}`
}], /*[{
  label: 'Theme',
  icon: 'i-lucide-palette',
  children: [{
    label: 'Primary',
    slot: 'chip',
    chip: appConfig.ui.colors.primary,
    content: {
      align: 'center',
      collisionPadding: 16
    },
    children: colors.map(color => ({
      label: color,
      chip: color,
      slot: 'chip',
      checked: appConfig.ui.colors.primary === color,
      type: 'checkbox',
      onSelect: (e) => {
        e.preventDefault()

        appConfig.ui.colors.primary = color
      }
    }))
  }, {
    label: 'Neutral',
    slot: 'chip',
    chip: appConfig.ui.colors.neutral === 'neutral' ? 'old-neutral' : appConfig.ui.colors.neutral,
    content: {
      align: 'end',
      collisionPadding: 16
    },
    children: neutrals.map(color => ({
      label: color,
      chip: color === 'neutral' ? 'old-neutral' : color,
      slot: 'chip',
      type: 'checkbox',
      checked: appConfig.ui.colors.neutral === color,
      onSelect: (e) => {
        e.preventDefault()

        appConfig.ui.colors.neutral = color
      }
    }))
  }]
}, {
  label: 'Appearance',
  icon: 'i-lucide-sun-moon',
  children: [{
    label: 'Light',
    icon: 'i-lucide-sun',
    type: 'checkbox',
    checked: colorMode.value === 'light',
    onSelect(e: Event) {
      e.preventDefault()

      colorMode.preference = 'light'
    }
  }, {
    label: 'Dark',
    icon: 'i-lucide-moon',
    type: 'checkbox',
    checked: colorMode.value === 'dark',
    onUpdateChecked(checked: boolean) {
      if (checked) {
        colorMode.preference = 'dark'
      }
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }]
}],*/ [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
  target: '_blank'
}, {
  label: 'GitHub repository',
  icon: 'i-simple-icons-github',
  to: 'https://github.com/Ejz9/Ember',
  target: '_blank'
}, {
  label: 'Log out',
  icon: 'i-lucide-log-out',
  onSelect: signOut
}]]))
</script>

<template>
  <UDropdownMenu
      :items="items"
      :content="{ align: 'center', collisionPadding: 12 }"
      :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton variant="ghost" color="neutral" class="data-[state=open]:bg-elevated" block :square="collapsed" :ui="{trailingIcon: 'text-dimmed'}">
      <UAvatar
          v-if="session.data?.user.image && !imageError"
          :src="session.data?.user.image"
          alt="User Avatar"
          size="md"
          @error="handleImageError"
      />
      <AvatarFallback
          v-else
          :value="session.data?.user.id ?? ''"
          :alt="session.data?.user.email"
          size="md"
      />
      <span v-if="!collapsed" class="truncate text-gray-900 dark:text-white font-semibold">
        {{session.data?.user.name}}
      </span>
    </UButton>

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
            class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
            :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
