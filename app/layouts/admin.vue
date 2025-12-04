<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const open = ref(false)

const links = [[{
  label: 'Dashboard',
  icon: 'i-lucide-house',
  to: '/admin',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Users',
  icon: 'i-lucide-users',
  to: '/admin/users',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Security',
  icon: 'i-lucide-shield',
  to: '/admin/security',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Configuration',
  icon: 'i-lucide-settings',
  to: '/admin/configuration',
  onSelect: () => {
    open.value = false
  }
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/Ejz9/Ember/issues',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/ember/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
        id="default"
        v-model:open="open"
        collapsible
        resizable
        class="bg-elevated/25"
        :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <UButton
            :collapsed="collapsed"
            class="w-full justify-center"
            to="/"
            variant="ghost"
            size="lg"
            color="primary"
            icon="i-lucide-arrow-left"
            label="Back to Applicaiton"/>
      </template>

      <template #default="{ collapsed }">
        <!--TODO Work on Search Button -->
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
            :collapsed="collapsed"
            :items="links[0]"
            orientation="vertical"
            tooltip
            popover
        />

        <UNavigationMenu
            :collapsed="collapsed"
            :items="links[1]"
            orientation="vertical"
            tooltip
            class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <AdminUserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
  </UDashboardGroup>
</template>
