<template>
  <!-- Skeleton Loader -->
  <UCard class="flex flex-col h-114">
    <template #header>
      <div class="flex justify-between items-start">
        <div>
          <USkeleton class="h-5 w-48" />
          <USkeleton class="h-4 w-24 mt-2" />
        </div>
        <div class="flex gap-2">
          <USkeleton class="h-6 w-16" />
        </div>
      </div>
    </template>
    <USkeleton class="h-10 w-full" />
    <div class="flex-1 mt-4">
      <USkeleton class="h-full w-full" />
    </div>
  </UCard>
</template>