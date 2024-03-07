<template>
  <div class="bg-gray-100 p-2 rounded-md">
    <span v-for="(part, i) in parts" :key="i">
      <span v-if="part.to">
        <nuxt-link :to="part.to" class="underline">{{ part.name }}</nuxt-link>
      </span>
      <span v-else>{{ part.name }}</span>
      <span v-if="i < parts.length - 1"> / </span>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  parts: { name: string; to?: string }[];
}>();
</script>
