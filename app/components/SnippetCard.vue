<script setup lang="ts">
const props = defineProps({
  snippet: {
    type: Object,
    required: true
  }
});

const isExpanded = ref(false);

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}

const router = useRouter();

function openSnippet(id: string) {
  router.push(`/snippets/${id}`);
}

const langMap: Record<string, string> = {
  'Plaintext': 'plaintext',
  'C': 'c',
  'C++': 'cpp',
  'C#': 'csharp',
  'CSS': 'css',
  'Dart': 'dart',
  'Docker': 'dockerfile',
  'Go': 'go',
  'GraphQL': 'graphql',
  'HTML': 'html',
  'Java': 'java',
  'JavaScript': 'javascript',
  'Kotlin': 'kotlin',
  'Lua': 'lua',
  'JSON': 'json',
  'Markdown': 'markdown',
  'PHP': 'php',
  'PowerShell': 'powershell',
  'Python': 'python',
  'R': 'r',
  'Ruby': 'ruby',
  'Rust': 'rust',
  'SCSS': 'scss',
  'Shell': 'shell',
  'SQL': 'sql',
  'Swift': 'swift',
  'TypeScript': 'typescript',
  'XML': 'xml',
  'YAML': 'yaml',
  '': 'plaintext' // Default fallback
}

const $hljs = useNuxtApp().$hljs;
const codeBlock = ref<HTMLElement>();
watch(codeBlock, (el) => {
      if (el) {
        $hljs.highlightElement(el);
      }
    },
    { flush: 'post' }
);
</script>

<template>
  <UCard class="flex flex-col h-114" :ui="{ body: 'flex flex-col flex-1 min-h-0 relative' }">
    <template #header>
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-bold mouse-pointer" @click="openSnippet(snippet._id)">{{ snippet.title }}</h3>
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
      <ScrollableContainer :is-expanded="isExpanded">
        <p :class="{ 'line-clamp-2': !isExpanded }">
          <span v-if="snippet.description">{{ snippet.description }}</span>
          <span v-else class="text-gray-400 italic"> It's probably something great!
      </span>
        </p>
        <UButton
            v-if="!isExpanded"
            variant="link"
            class="absolute top-5 right-0 z-10 bg-white dark:bg-neutral-900"
            @click="toggleExpanded"
        >
          ...view more
        </UButton>
      </ScrollableContainer>

      <!-- Code Preview -->
      <UTabs v-if="!isExpanded && snippet.tabItems && snippet.tabItems.length" :items="snippet.tabItems" class="flex flex-col flex-1">
        <template #content="{ item }">
          <div class="bg-gray-100 dark:bg-gray-800 rounded-md h-40 select-none">
            <pre class="h-full"><code ref="codeBlock" :class="langMap[item.language] || langMap['']" class="h-full overflow-hidden">{{ item.code }}</code></pre>
          </div>
        </template>
      </UTabs>

      <UButton
          v-if="isExpanded"
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
            <UBadge color="primary" variant="subtle">{{ snippet.tags[0] }}</UBadge>

            <UBadge v-if="snippet.tags.length > 1" color="neutral" variant="subtle">{{ snippet.tags[1] }}</UBadge>

            <UBadge color="neutral" variant="subtle" v-if="snippet.tags.length > 2">
              +{{ snippet.tags.length - 2 }} more
            </UBadge>
          </template>
        </div>
        <UTooltip v-if="snippet.updatedAt" :text="new Date(snippet.updatedAt).toLocaleString()" arrow :content="{ side: 'top' }">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Modified: {{ new Date(snippet.updatedAt).toLocaleDateString() }}
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
