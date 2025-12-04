<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { authClient } from '~/lib/auth-client';
import type {Snippet} from "#shared/snippet-schema";
import { getComplexityLevel } from "~/utils/complexity-formatter";
import type { TableColumn } from '@nuxt/ui'
import type {ComplexityElement} from "#shared/snippet-schema";


const route = useRoute();
const router = useRouter();
const id = route.params.id;

definePageMeta({
  middleware: ['snippet-access']
});

const { data: snippet, pending, error } = await useFetch<Snippet>(`/api/snippets/${id}`, {
  key: `snippet-${id}`
});

const session = authClient.useSession()
const isAuthor = computed(() => {
  if (!session.data) {
    return false;
  }
  return session.data?.value?.user?.id === snippet.value?.userId;
});

const tabItems = computed(() => {
  if (!snippet.value?.fragments) return [];
  return snippet.value.fragments.map((fragment, index) => ({
    slot: `fragment-${index}`,
    label: fragment.label,
    icon: 'i-heroicons-code-bracket-square',
    content: fragment.code,
    language: fragment.language
  }));
});

function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

const columns: TableColumn<ComplexityElement>[] = [
  { id: 'Label', accessorKey: 'Label', },
  { id: 'Language', accessorKey: 'Language',},
  { id: 'Lines', accessorKey: 'Lines', },
  { id: 'Code', accessorKey: 'Code',},
  { id: 'Comment', accessorKey: 'Comment',},
  { id: 'Blank', accessorKey: 'Blank', },
  { id: 'Complexity', accessorKey: 'Complexity',},
  { id: 'Bytes', accessorKey: 'Bytes',}
];

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

function getMonacoLanguage(friendlyName: string): string {
  return langMap[friendlyName] || 'plaintext';
}

const toast = useToast();
const { copy } = useClipboard();

function copyCode(code: string) {
  copy(code);
  toast.add({ title: 'Copied!', description: 'Code has been copied to your clipboard.', icon: 'i-heroicons-check-circle' });
}

async function deleteSnippet() {
  if (confirm('Are you sure you want to delete this snippet?')) {
    try {
      await $fetch(`/api/snippets/${id}`, {
        method: 'DELETE'
      });
      toast.add({ title: 'Success', description: 'Snippet deleted successfully.', color: 'green' });
      await router.push('/');
    } catch (e) {
      toast.add({ title: 'Error', description: 'Failed to delete snippet.', color: 'red' });
    }
  }
}
</script>

<template>
  <UContainer>
    <div v-if="pending">
      <p>Loading...</p>
    </div>
    <div v-else-if="error">
      <p>Error loading snippet: {{ error.message }}</p>
    </div>
    <div v-else-if="snippet" class="space-y-8 py-8">
      <!-- Header -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold">{{ snippet.title }}</h1>
              <p class="text-gray-500 mt-1">
                Authored by <NuxtLink :to="`/user/${snippet.userId}`" class="text-primary-500 hover:underline">{{ snippet.author }}</NuxtLink>
                on {{ new Date(snippet.updatedAt).toLocaleString() }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <UBadge v-if="snippet.isPublic" color="primary" variant="subtle">Public</UBadge>
              <UBadge v-else color="error" variant="subtle">Private</UBadge>
              <UButton v-if="session.data?.user?.id === snippet?.userId" icon="i-heroicons-pencil-square" size="sm" color="primary" variant="outline" :to="`/snippets/${id}/edit`">Edit</UButton>
              <UButton v-if="session.data?.user?.id === snippet?.userId" icon="i-heroicons-trash" size="sm" color="error" variant="outline" @click="deleteSnippet">Delete</UButton>
            </div>
          </div>
        </template>
        <p v-if="snippet.description" class="text-gray-600 dark:text-gray-300">{{ snippet.description }}</p>
        <p v-else class="text-gray-400 italic">No description provided.</p>
      </UCard>

      <!-- Code Fragments -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-lg">Code Fragments</h3>
        </template>
        <UTabs :items="tabItems" class="w-full">
          <template v-for="(item, index) in tabItems" #[item.slot]="{ item: currentItem }">
            <div class="relative">
              <div class="border border-neutral-200 dark:border-neutral-800 rounded-md">
                <MonacoEditor
                    :model-value="currentItem.content"
                    :lang="getMonacoLanguage(currentItem.language)"
                    :options="{
                      theme: 'vs-dark',
                      automaticLayout: true,
                      wordWrap: 'on',
                      readOnly: true,
                      minimap: { enabled: false },
                    }"
                    class="h-96 w-full"
                />
              </div>
              <UButton
                  icon="i-heroicons-clipboard-document"
                  size="xl"
                  color="primary"
                  variant="ghost"
                  class="absolute bottom-2 right-6"
                  @click="copyCode(currentItem.content)"
              />
            </div>
          </template>
        </UTabs>
      </UCard>

      <!-- Metadata -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-lg">Details</h3>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium mb-2">Tags</h4>
            <div v-if="snippet.tags && snippet.tags.length > 0" class="flex flex-wrap gap-2">
              <UBadge v-for="tag in snippet.tags" :key="tag" color="primary" variant="subtle">{{ tag }}</UBadge>
            </div>
            <p v-else class="text-gray-400 italic">No tags.</p>
          </div>
          <div>
            <h4 class="font-medium mb-2">Related Links</h4>
            <div v-if="snippet.relatedLinks && snippet.relatedLinks.length > 0" class="flex flex-col gap-2">
              <a v-for="link in snippet.relatedLinks" :key="link" :href="link" target="_blank" class="text-primary-500 hover:underline">{{ link }}</a>
            </div>
            <p v-else class="text-gray-400 italic">No related links.</p>
          </div>
          <USeparator class="md:col-span-2"/>
          <div v-if="snippet.sccStats.length > 0" class="md:col-span-2">
            <h4 class="font-medium mb-2">SCC Stats</h4>
            <UTable :data="snippet.sccStats" :columns="columns">
              <template #Complexity-cell="{ row }">
                <UTooltip :text="getComplexityDescription(row.original.Complexity)">
                  <UBadge
                      :color="getComplexityLevel(row.original.Complexity).color"
                      :icon="getComplexityLevel(row.original.Complexity).icon"
                      variant="subtle"
                  >
                    {{ getComplexityLevel(row.original.Complexity).label }}
                  </UBadge>
                </UTooltip>
              </template>
              <template #Bytes-cell="{ row }">
                <span>{{ formatBytes(row.original.Bytes) }}</span>
              </template>
              </UTable>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<style scoped>
</style>