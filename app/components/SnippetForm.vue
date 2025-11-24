<script setup lang="ts">
import * as z from 'zod'
import { vMaska } from "maska/vue"
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  isPublic: z.boolean().optional(),
  title: z.string('Title is required').min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  framework: z.string().optional(),
  frameworkVersion: z.string().optional(),
  relatedLinks: z.array(z.string()).optional(),
  fragments: z.array(z.object({
    label: z.string('Label is required').min(1, 'Label is required'),
    language: z.string('Language is required').min(1, 'Language is required'),
    code: z.string('Code is required').min(1, 'Code is required')
  })).min(1, 'At least one code fragment is required')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  isPublic: false,
  title: undefined,
  description: undefined,
  tags: [],
  framework: undefined,
  frameworkVersion: undefined,
  relatedLinks: [],
  fragments: []
});

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
});

function addFragment() {
  state.fragments = state.fragments || [];
  (state.fragments as any[]).push({
    label: '',
    language: '',
    code: '',
    isOpen: true
  });
}

function removeFragment(index: number) {
  state.fragments?.splice(index, 1);
}

onMounted(() => {
  if (props.initialData && Object.keys(props.initialData).length > 0) {
    Object.assign(state, props.initialData)
    if (state.fragments) {
      state.fragments.forEach(f => (f as any).isOpen = true);
    }
    if (!state.fragments || state.fragments.length === 0) {
      addFragment();
    }
  } else {
    addFragment();
  }
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'primary' })
  emit('submit', event.data)
}

const emit = defineEmits(['submit'])

const isEditing = computed(() => !!props.initialData._id)

const languages = ['Plaintext', 'JSON', 'C', 'C++', 'C#', 'CSS', 'Dart', 'Docker', 'Go', 'GraphQL', 'HTML', 'Java', 'JavaScript', 'Kotlin', 'Lua', 'Markdown', 'MySQL', 'PHP', 'PowerShell', 'Python', 'R', 'Ruby', 'Rust', 'SCSS', 'Shell', 'SQL', 'Swift', 'TypeScript', "XML", "YAML"];

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

const extensionToLanguageMap: Record<string, string> = {
  'txt': 'Plaintext',
  'json': 'JSON',
  'c': 'C',
  'cpp': 'C++',
  'cs': 'C#',
  'css': 'CSS',
  'dart': 'Dart',
  'dockerfile': 'Docker',
  'go': 'Go',
  'graphql': 'GraphQL',
  'html': 'HTML',
  'java': 'Java',
  'js': 'JavaScript',
  'kt': 'Kotlin',
  'lua': 'Lua',
  'md': 'Markdown',
  'mysql': 'MySQL',
  'php': 'PHP',
  'ps1': 'PowerShell',
  'py': 'Python',
  'r': 'R',
  'rb': 'Ruby',
  'rs': 'Rust',
  'scss': 'SCSS',
  'sh': 'Shell',
  'sql': 'SQL',
  'swift': 'Swift',
  'ts': 'TypeScript',
  'xml': 'XML',
  'yaml': 'YAML',
  'yml': 'YAML'
};

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  return extensionToLanguageMap[extension] || 'Plaintext';
}

const fileUploadModel = ref<File[] | null>(null);
function onFileChange(files: File[] | null) {
  // 'files' is now correctly typed as a File array or null.
  if (!files || files.length === 0) return;

  // We can loop 'files' directly.
  for (const file of files) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const code = e.target?.result as string;
      const language = getLanguageFromExtension(file.name);
      const label = file.name;
      state.fragments = state.fragments || [];

      // Create the new fragment object
      const newFragment = {
        label,
        language,
        code,
        isOpen: true
      };

      // Check if the first fragment is empty and should be replaced
      if (state.fragments.length === 1 && !state.fragments[0].code && !state.fragments[0].label) {

        // Use splice to replace the empty fragment
        // This is guaranteed to trigger reactivity.
        state.fragments.splice(0, 1, newFragment);

      } else {
        // Otherwise, just add the new fragment
        (state.fragments as any[]).push(newFragment);
      }
    };

    reader.readAsText(file);
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-8" @submit="onSubmit">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h1 class="text-3xl font-bold">{{ isEditing ? 'Edit Snippet' : 'Create New Snippet' }}</h1>
        <p class="text-gray-500 mt-1">Fill out the details below to {{ isEditing ? 'update your' : 'create a new' }} code snippet.</p>
      </div>
      <UButton type="submit" size="lg" icon="i-heroicons-arrow-down-tray-16-solid">{{ isEditing ? 'Save Changes' : 'Create Snippet' }}</UButton>
    </div>

    <!-- Snippet Details Section -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-lg">{{ state.title || 'New Snippet' }}</h3>
        </div>
      </template>
      <div class="space-y-6">
        <div class="flex-1 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UFormField label="Title" name="title" required>
              <UInput
                  v-model="state.title"
                  placeholder="e.g., Better Auth Config"
                  size="xl"
                  :maxlength="25"
                  aria-describedby="character-count"
                  :ui="{ trailing: 'pointer-events-none' }"
                  class="w-full"
              >
                <template #trailing>
                  <div
                      id="character-count"
                      class="text-xs text-muted tabular-nums"
                      aria-live="polite"
                      role="status"
                  >
                    {{ state.title?.length || 0 }} / 25
                  </div>
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Framework" name="framework">
              <UInput v-model="state.framework" placeholder="e.g., Nuxt" size="xl" class="w-full"/>
            </UFormField>
            <UFormField label="Framework Version" name="frameworkVersion">
              <UInput v-model="state.frameworkVersion" v-maska="'#00.000.000'" data-maska-tokens="0:[0-9]:optional" placeholder="e.g., 4.0.2" size="xl" class="w-full"/>
            </UFormField>
          </div>
          <UFormField label="Description" name="description">
            <UTextarea
                v-model="state.description"
                placeholder="A short description of what this snippet does."
                size="xl"
                class="h-full w-full"
                :rows="4"
                :maxrows="4"
                autoresize
                :maxlength="500"
            >
              <template #trailing>
                <div
                    id="character-count"
                    class="text-xs text-muted tabular-nums relative bottom-8"
                    aria-live="polite"
                    role="status"
                >
                  {{ state.description?.length || 0 }} / 500
                </div>
              </template>
            </UTextarea>
          </UFormField>
        </div>

        <USeparator />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Tags" name="tags">
            <UInputTags v-model="state.tags" placeholder="Add tags..." size="xl" :max-length="10" class="w-full"/>
          </UFormField>
          <UFormField label="Related Links" name="relatedLinks">
            <UInputTags v-model="state.relatedLinks" placeholder="Add links..." size="xl" class="w-full"/>
          </UFormField>
        </div>

        <USeparator />

        <UFormField name="isPublic" help="Make this snippet visible to everyone.">
          <div class="flex items-center gap-4">
            <label for="is-public-toggle" class="font-medium">Visibility</label>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">{{ state.isPublic ? 'Public' : 'Private' }}</span>
              <USwitch id="is-public-toggle" v-model="state.isPublic" size="lg" />
            </div>
          </div>
        </UFormField>
      </div>
    </UCard>

    <!-- Fragments Section -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-lg">Code Fragments</h3>
          <UFileUpload
              @update:modelValue="onFileChange"
              :modelValue="fileUploadModel"
              multiple
              color="primary"
          />
        </div>
      </template>

      <div class="space-y-4">
        <UCard
            v-if="state.fragments && state.fragments.length > 0"
            v-for="(fragment, index) in state.fragments"
            :key="index"
            class="!ring-1 !ring-neutral-200 dark:!ring-neutral-800"
        >
          <UCollapsible v-model:open="(fragment as any).isOpen">
            <template #default="{ open }">
              <div class="flex justify-between items-center cursor-pointer p-4">
                <div class="flex flex-col md:flex-row md:items-center gap-4 flex-1" @click.stop>
                  <UFormField label="Label" :name="`fragments.${index}.label`" required class="flex-1">
                    <UInput v-model="fragment.label" placeholder="Fragment Label (e.g., Component)" size="xl" class="w-full"/>
                  </UFormField>
                  <UFormField label="Language" :name="`fragments.${index}.language`" required class="flex-1">
                    <USelectMenu v-model="fragment.language" :items="languages" placeholder="Select a language..." size="xl" class="w-full"/>
                  </UFormField>
                </div>
                <div class="flex items-start ml-4 gap-2 pt-6">
                  <UIcon name="i-lucide-chevron-down" class="transition-transform duration-200" :class="{'rotate-180': open}"/>
                  <UButton v-if="state.fragments.length > 1" color="primary" variant="ghost" size="xl" icon="i-heroicons-x-mark-20-solid" @click.stop="removeFragment(index)"/>
                </div>
              </div>
            </template>

            <template #content>
              <div class="p-4 border-t border-neutral-200 dark:border-neutral-800">
                  <UFormField label="Code" :name="`fragments.${index}.code`" required>
                    <!--Praise be to god this exists-->
                    <MonacoEditor
                        v-model="fragment.code"
                        :lang="getMonacoLanguage(fragment.language)"
                        :options="{
                          theme: 'vs-dark',
                          automaticLayout: true,
                          wordWrap: 'on',
                          minimap: { enabled: false }
                        }"
                        class="border border-neutral-200 dark:border-neutral-800 rounded-md"
                        :style="{ height: '400px', width: '100%' }"
                    />
                  </UFormField>
                </div>
            </template>
          </UCollapsible>
        </UCard>
      </div>
      <template #footer>
        <button class="text-center py-8 border-2 border-dashed rounded-lg hover:bg-neutral-700 w-full" @click="addFragment">
          <span class="text-neutral-500">New Fragment</span>
        </button>
      </template>
    </UCard>
  </UForm>
</template>

<style scoped>
</style>
