<script setup lang="ts">
const props = defineProps({
  isExpanded: {
    type: Boolean,
    default: false
  }
});

const scrollContainerRef = ref<HTMLElement | null>(null);
const showTopFade = ref(false);
const showBottomFade = ref(false);

const updateFades = () => {
  const el = scrollContainerRef.value;
  if (!el) return;

  const { scrollTop, scrollHeight, clientHeight } = el;
  const buffer = 1; // A 1px buffer helps prevent rounding errors at the edges.

  // Show top fade if the user has scrolled down from the top.
  showTopFade.value = scrollTop > buffer;

  // Show bottom fade if there is more content to scroll to at the bottom.
  showBottomFade.value = scrollTop < scrollHeight - clientHeight - buffer;
};

watch(() => props.isExpanded, (isExpanded) => {
  // Use nextTick to ensure the DOM has been updated (e.g., overflow applied)
  // before we check the scroll dimensions.
  nextTick(() => {
    if (isExpanded) {
      updateFades();
    } else {
      // If not expanded, there's no scrolling, so hide fades.
      showTopFade.value = false;
      showBottomFade.value = false;
    }
  });
}, {
  immediate: true
});

</script>

<template>
  <div class="flex-grow relative min-h-0">

    <div class="fade-top" :class="{ 'is-visible': showTopFade }" />
    <div class="fade-bottom" :class="{ 'is-visible': showBottomFade }" />

    <!--
      This inner div handles the scrolling. It fills the outer container (`h-full`)
      and its content overflows, creating the scrollbar. The @scroll event is
      fired by this element.
    -->
    <div
        ref="scrollContainerRef"
        class="h-full w-full"
        :class="{ 'overflow-y-auto no-bar': isExpanded }"
        @scroll="updateFades"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fade-top,
.fade-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 24px;
  z-index: 5;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
}

.fade-top.is-visible,
.fade-bottom.is-visible {
  opacity: 1;
}

.fade-top {
  top: 0;
  background: linear-gradient(to bottom, rgb(255 255 255) 20%, rgb(255 255 255 / 0));
}

.fade-bottom {
  bottom: 0;
  background: linear-gradient(to top, rgb(255 255 255) 20%, rgb(255 255 255 / 0));
}

/* --- Dark Mode --- */
.dark .fade-top {
  background: linear-gradient(to bottom, rgb(23 23 23) 20%, rgb(23 23 23 / 0));
}

.dark .fade-bottom {
  background: linear-gradient(to top, rgb(23 23 23) 20%, rgb(23 23 23 / 0));
}

/* --- Scrollbar Hiding --- */
.no-bar::-webkit-scrollbar {
  display: none;
}
.no-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
