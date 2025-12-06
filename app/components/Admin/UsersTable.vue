<script setup lang="ts">
import type {TableColumn} from "@nuxt/ui";
import type {User} from "better-auth";

const { data: users, pending, error } = useFetch(`/api/admin/users`);

const columns: TableColumn<User>[] = [
  { key: 'userId', accessorKey: 'UserID'},
  { key: 'user', accessorKey: 'User' },
  { key: 'email', accessorKey: 'Email' },
  { key: 'lastseen', accessorKey: 'LastSeen', }
];

const imageError = ref(false)
const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <UTable
      :data="users"
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
    <template #UserID-cell="{ row }">
      <a :href="`/user/${row.original._id}`" class="text-primary-500 hover:underline">
        #{{ row.original._id }}
      </a>
    </template>

    <template #Email-cell="{ row }">
      {{ row.original.email }}
    </template>

    <template #User-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar
            v-if="row.original.image && !imageError"
            :src="row.original.image"
            alt="User Avatar"
            size="md"
            @error="handleImageError"
        />
        <AvatarFallback
            v-else
            :value="row.original.image ?? ''"
            :alt="row.original.image"
            size="md"
        />
        <div class="text-sm">
          <div class="font-medium text-gray-900 dark:text-white">{{ row.original.name }}</div>
          <div class="text-gray-500 dark:text-gray-400">#{{ row.original._id }}</div>
        </div>
      </div>
    </template>

    <template #Name-cell="{ row }">
      {{ row.original.name }}
    </template>


    <template #LastSeen-cell="{ row }">
      {{ new Date(row.original.updatedAt).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
      }) }}
    </template>
  </UTable>
</template>

<style scoped>

</style>