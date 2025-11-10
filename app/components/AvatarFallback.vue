<script setup lang="ts">
import { toSvg } from 'jdenticon'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  },
  alt: {
    type: String,
    default: 'Avatar Fallback'
  }
})

const sizeMap = {
  'xs': 20,
  'sm': 30,
  'md': 40,
  'lg': 50,
  'xl': 60,
  '2xl': 70
}

const numericSize = computed(() => {
  return sizeMap[props.size] || 40
})

const identiconSvg = computed(() => {
  const svgString = toSvg(props.value, numericSize.value)
  return `data:image/svg+xml;base64,${btoa(svgString)}`
})
</script>

<template>
  <UAvatar
      :src="identiconSvg"
      :alt="alt"
      :size="size"
  />
</template>
