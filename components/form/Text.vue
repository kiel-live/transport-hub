<template>
  <div>
    <input v-model="model" :type="type" class="border rounded-md border-gray-300 p-2" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>();

withDefaults(
  defineProps<{
    placeholder: string;
    type?: string;
  }>(),
  {
    type: 'text',
  },
);
</script>
