<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import type { TableColumn } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  limit: number
  enableScroll?: boolean
}>(), {
  limit: 10,
  enableScroll: true
})

const page = ref(1);
const table = useTemplateRef<any>('table')
const logs = ref<AuditLogEntry[]>([])

const { data, pending, status } = await useFetch('/api/admin/changes', {
  key: 'table-users-infinite-scroll',
  query: {
    limit: props.limit,
    page: page,
  },
  watch: [page],
  immediate: true
});

onMounted(() => {
  if (props.enableScroll && table.value) {
    useInfiniteScroll(
        table.value.$el,
        () => {
          if (status.value !== 'pending') {
            page.value++
          }
        },
        {
        }
    )
  }
})

watch(data, (newBatch) => {
  if (page.value === 1) {
    logs.value = newBatch || []
  } else if (newBatch && newBatch.length > 0) {
    logs.value.push(...newBatch)
  }
}, { immediate: true })

interface AuditLogEntry {
  snippetId: string
  userId: string
  email: string
  action: 'created' | 'updated' | 'deleted'
  date: string
}

const columns: TableColumn<AuditLogEntry>[] = [
  { key: 'snippetId', accessorKey: 'SnippetID' },
  { key: 'userId', accessorKey: 'UserID'},
  { key: 'date', accessorKey: 'Date' },
  { key: 'action', accessorKey: 'Action' },
  { key: 'email', accessorKey: 'Email', }
];
</script>

<template>
  <UTable
      ref="table"
      :data="logs"
      :columns="columns"
      class="shrink-0"
      :class="props.enableScroll ? 'h-full overflow-y-auto' : 'h-auto'"
      :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: props.enableScroll ? 'sticky top-0 z-10 [&>tr]:bg-elevated/50 [&>tr]:after:content-none\'' : '[&>tr]:bg-elevated/50 [&>tr]:after:content-none\'',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default'
    }"
  >
    <template #SnippetID-cell="{ row }">
      <a :href="`/snippets/${row.original.snippetId}`" class="text-primary-500 hover:underline">
        #{{ row.original.snippetId }}
      </a>
    </template>

    <template #UserID-cell="{ row }">
      <a :href="`/user/${row.original.snippetId}`" class="text-primary-500 hover:underline">
        #{{ row.original.userId }}
      </a>
    </template>


    <template #Date-cell="{ row }">
      {{ new Date(row.original.createdAt).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) }}
    </template>

    <template #Action-cell="{ row }">
      <UBadge
          :color="{ created: 'green', updated: 'orange', deleted: 'red' }[row.original.action]"
          class="capitalize"
          variant="subtle"
      >
        {{ row.original.action }}
      </UBadge>
    </template>

    <template #Email-cell="{ row }">
      {{ row.original.email }}
    </template>
  </UTable>
</template>
