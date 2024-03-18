<template>
  <nuxt-link
    v-if="to"
    :to="to"
    :target="target"
    class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
  >
    <slot />
  </nuxt-link>
  <button v-else class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  to?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}>();
</script>
