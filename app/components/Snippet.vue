<script setup lang="ts">
const props = defineProps({
  snippet: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle-expanded']);

function toggleExpanded() {
  emit('toggle-expanded', props.snippet.id);
}
</script>

<template>
  <UCard class="flex flex-col h-114" :ui="{ body: 'flex flex-col flex-1 min-h-0 relative' }">
    <template #header>
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-bold">{{ snippet.title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ snippet.author }}</p>
        </div>
        <div class="flex gap-2">
          <UBadge v-if="snippet.fragments && snippet.fragments.length > 0" :icon="snippet.fragments[0].icon" variant="outline">{{ snippet.fragments[0].language }}</UBadge>
          <UBadge v-if="snippet.fragments && snippet.fragments.length > 1" variant="outline">+{{ snippet.fragments.length - 1 }}</UBadge>
        </div>
      </div>
    </template>

    <!-- Description -->
    <template #default>
      <ScrollableContainer :is-expanded="snippet.isExpanded">
        <p :class="{ 'line-clamp-2': !snippet.isExpanded }">
          <span v-if="snippet.description">{{ snippet.description }}</span>
          <span v-else class="text-gray-400 italic"> It's probably something great!
      </span>
        </p>
        <UButton
            v-if="!snippet.isExpanded"
            variant="link"
            class="absolute top-5 right-0 z-10 bg-white dark:bg-neutral-900"
            @click="toggleExpanded"
        >
          ...view more
        </UButton>
      </ScrollableContainer>

      <!-- Code Preview -->
      <UTabs v-if="!snippet.isExpanded && snippet.tabItems && snippet.tabItems.length" :items="snippet.tabItems" class="flex flex-col flex-1">
        <template #content="{ item }">
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-md h-40 overflow-hidden select-none">
            <pre><code>{{ item.code }}</code></pre>
          </div>
        </template>
      </UTabs>

      <UButton
          v-if="snippet.isExpanded"
          variant="link"
          class="absolute bottom-0 right-5 z-10"
          @click="toggleExpanded"
      >
        View Less
      </UButton>
    </template>

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="flex gap-2 min-h-6 items-center">

          <template v-if="snippet.tags && snippet.tags.length > 0">
            <UBadge color="blue" variant="subtle">{{ snippet.tags[0] }}</UBadge>

            <UBadge v-if="snippet.tags.length > 1" color="gray" variant="subtle">{{ snippet.tags[1] }}</UBadge>

            <UBadge color="gray" variant="subtle" v-if="snippet.tags.length > 2">
              +{{ snippet.tags.length - 2 }} more
            </UBadge>
          </template>
        </div>
        <UTooltip v-if="snippet.modifiedAt" :text="new Date(snippet.modifiedAt).toLocaleString()" arrow :content="{ side: 'top' }">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Modified: {{ new Date(snippet.modifiedAt).toLocaleDateString() }}
          </p>
        </UTooltip>
      </div>
    </template>
  </UCard>
</template>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
