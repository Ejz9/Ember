<script setup lang="ts">
import Snippet from "~/components/Snippet.vue";

const query = ref('')
const pending = ref(false);
const expandedSnippetIds = ref<string[]>([]);

const snippets = ref([
  {
    id: '1',
    title: 'Nuxt 3 Server Route1',
    modifiedAt: new Date(),
    description: 'How to create a POST route in Nuxt. This is a longer description to demonstrate the truncation and view more functionality. It should be long enough to wrap to multiple lines and then get truncated. How to create a POST route in Nuxt. This is a longer description to demonstrate the truncation and view more functionality. It should be long enough to wrap to multiple lines and then get truncated. How to create a POST route in Nuxt. This is a longer description to demonstrate the truncation and view more functionality. It should be long enough to wrap to multiple lines and then get truncated. How to create a POST route in Nuxt. This is a longer description to demonstrate the truncation and view more functionality. It should be long enough to wrap to multiple lines and then get truncated. How to create a POST route in Nuxt. This is a longer description to demonstrate the truncation and view more functionality. It should be long enough to wrap to multiple lines and then get truncated. How to create a POST route in Nuxt. This is a longer description to demonstrate the truncation and view more functionality. It should be long enough to wrap to multiple lines and then get truncated.',
    tags: ['nuxt', 'api', 'js', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts', 'ts'],
    author: '1234567891234567891234567',
    starred: true,
    version: '1.0.0',
    frameworkVersion: 'Nuxt 3',
    relatedLinks: ['https://nuxt.com/docs/guide/directory-structure/server'],
    estimatedComplexity: 'Intermediate',
    fragments: [
      {
        id: '1',
        label: 'utils.js',
        language: 'typescript',
        icon: 'vscode-icons:file-type-typescript-official',
        code: `function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
        const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
    }`,
      },
      {
        id: '2',
        label: 'db.js',
        language: 'javascript',
        icon: 'vscode-icons:file-type-node',
        code: `const { MongoClient } = require(\'mongodb\');

      const uri = "mongodb+srv://<user>:<password>@<cluster-url>/test?retryWrites=true&w=majority";
      const client = new MongoClient(uri);

      async function run() {
        try {
        await client.connect();
        console.log("Connected successfully to server");
      } finally {
        await client.close();
      }
    }
      run().catch(console.dir);`
      },
      {
        id: '3',
        label: 'MyComponent.vue',
        language: 'javascript',
        icon: 'vscode-icons:file-type-vue',
        code: `import { ref, computed } from \'vue\';

      const count = ref(1);
      const plusOne = computed(() => count.value + 1);

      console.log(plusOne.value); // 2

      count.value++;
      console.log(plusOne.value); // 3`
      },
      {
        id: '4',
        label: 'MyComponent.vue',
        language: 'javascript',
        icon: 'vscode-icons:file-type-vue',
        code: `import { ref, computed } from \'vue\';

      const count = ref(1);
      const plusOne = computed(() => count.value + 1);

      console.log(plusOne.value); // 2

      count.value++;
      console.log(plusOne.value); // 3`
      }
    ],
  },
  {
    id: '2',
    title: 'Vue 3 computed',
    description: 'A simple example of a computed property. This description is also a bit longer to show how the truncation works.',
    tags: ['vue', 'javascript'],
    modifiedAt: new Date('2023-10-20T10:00:00Z'),
    author: 'Jane Smith',
    starred: false,
    version: '1.1.0',
    frameworkVersion: 'Vue 3',
    relatedLinks: ['https://vuejs.org/guide/essentials/computed.html'],
    estimatedComplexity: 'Beginner',
    fragments: [
      {
        id: '1',
        label: 'MyComponent.vue',
        language: 'javascript',
        icon: 'vscode-icons:file-type-vue',
        code: `import { ref, computed } from \'vue\';

      const count = ref(1);
      const plusOne = computed(() => count.value + 1);

      console.log(plusOne.value); // 2

      count.value++;
      console.log(plusOne.value); // 3`
      }
    ],
  },
  {
    id: '3',
    title: 'MongoDB Atlas Connection1',
    description: 'Node.js snippet to connect to MongoDB. Another long description to ensure that the card heights are consistent and the view more functionality can be tested properly across multiple cards.',
    tags: ['mongo', 'database', 'node'],
    modifiedAt: new Date('2023-09-15T14:30:00Z'),
    author: 'John Doe',
    starred: true,
    version: '1.0.1',
    frameworkVersion: 'Node.js',
    relatedLinks: ['https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/'],
    estimatedComplexity: 'Intermediate',
    fragments: [
      {
        id: '1',
        label: 'db.js',
        language: 'javascript',
        icon: 'vscode-icons:file-type-node',
        code: `const { MongoClient } = require(\'mongodb\');

      const uri = "mongodb+srv://<user>:<password>@<cluster-url>/test?retryWrites=true&w=majority";
      const client = new MongoClient(uri);

      async function run() {
        try {
        await client.connect();
        console.log("Connected successfully to server");
      } finally {
        await client.close();
      }
    }
      run().catch(console.dir);`
      },
      {
        id: '2',
        label: 'utils.js',
        language: 'javascript',
        icon: 'vscode-icons:file-type-typescript-official',
        code: 'function'
      }
    ],
  },
  {
    id: '4',
    title: 'MongoDB Atlas Connection1',
    description: 'Node.js snippet to connect to MongoDB. Another long description to ensure that the card heights are consistent and the view more functionality can be tested properly across multiple cards.',
    tags: ['mongo', 'database', 'node'],
    modifiedAt: new Date('2023-09-15T14:30:00Z'),
    author: 'John Doe',
    starred: true,
    version: '1.0.1',
    frameworkVersion: 'Node.js',
    relatedLinks: ['https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/'],
    estimatedComplexity: 'Intermediate',
    fragments: [
      {
        id: '4',
        label: 'db.js',
        language: 'javascript',
        icon: 'vscode-icons:file-type-node',
        code: `const { MongoClient } = require(\'mongodb\');

      const uri = "mongodb+srv://<user>:<password>@<cluster-url>/test?retryWrites=true&w=majority";
      const client = new MongoClient(uri);

      async function run() {
        try {
        await client.connect();
        console.log("Connected successfully to server");
      } finally {
        await client.close();
      }
    }
      run().catch(console.dir);`
      },
      {
        id: '2',
        label: 'utils.js',
        language: 'javascript',
        icon: 'vscode-icons:file-type-typescript-official',
        code: 'function'
      }
    ],
  },
  {
    id: '5',
    title: 'Vue 3 computed',
    description: '',
    tags: [],
    modifiedAt: new Date('2023-10-20T10:00:00Z'),
    author: 'Jane Smith',
    starred: false,
    version: '1.1.0',
    frameworkVersion: 'Vue 3',
    relatedLinks: ['https://vuejs.org/guide/essentials/computed.html'],
    estimatedComplexity: 'Beginner',
    fragments: [
      {
        id: '1',
        label: 'MyComponent.vue',
        language: 'javascript',
        icon: 'vscode-icons:file-type-vue',
        code: `import { ref, computed } from \'vue\';

      const count = ref(1);
      const plusOne = computed(() => count.value + 1);

      console.log(plusOne.value); // 2

      count.value++;
      console.log(plusOne.value); // 3`
      }
    ],
  },
])

const filteredSnippets = computed(() => {
  const allSnippets = snippets.value.map(snippet => ({
    ...snippet,
    isExpanded: expandedSnippetIds.value.includes(snippet.id),
    tabItems: snippet.fragments ? snippet.fragments.map(f => ({ label: f.label.slice(f.label.lastIndexOf('.') + 1), code: f.code })) : []
  }));

  if (!query.value) {
    return allSnippets;
  }

  return allSnippets.filter(snippet =>
      snippet.title.toLowerCase().includes(query.value.toLowerCase()) ||
      snippet.description.toLowerCase().includes(query.value.toLowerCase())
  );
})

function toggleExpanded(snippetId: string) {
  if (expandedSnippetIds.value.includes(snippetId)) {
    expandedSnippetIds.value = expandedSnippetIds.value.filter(id => id !== snippetId);
  } else {
    expandedSnippetIds.value.push(snippetId);
  }
}
</script>

<template>
  <UContainer>
    <UInput
        v-model="query"
        icon="i-lucide-search"
        size="xl"
        placeholder="Search"
        class="my-8"
    />

    <div v-if="pending">
      Loading...
    </div>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
      <Snippet v-for="snippet in filteredSnippets" :key="snippet.id" :snippet="snippet" @toggle-expanded="toggleExpanded" />
    </div>
  </UContainer>
</template>

<style scoped>
</style>
