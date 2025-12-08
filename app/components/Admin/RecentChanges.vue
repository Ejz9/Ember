<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  limit: number
}>()

const page = ref(1)

const { data: changes, pending, error } = useFetch(`/api/admin/changes`, {
  query: {
    limit: props.limit,
    page: page,
  },
});

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
      :data="changes"
      :columns="columns"
      class="shrink-0"
      :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
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
