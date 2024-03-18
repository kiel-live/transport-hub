<template>
  <div class="flex flex-col mx-auto h-full w-full">
    <ClientOnly>
      <Map :stops="stops || undefined" @visible-area-changed="visibleArea = $event" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { LngLatBounds } from 'maplibre-gl';
import { refDebounced } from '@vueuse/core';

const center = ref<[number, number]>([10.375386, 50.9052784]);
const zoom = ref<number>(4);

const visibleArea = ref<LngLatBounds>();
const debouncedVisibleArea = refDebounced(visibleArea, 500);

const { data: stops } = await useFetch('/api/stops', {
  method: 'GET',
  query: computed(() => ({
    top: debouncedVisibleArea.value?.getNorth(),
    left: debouncedVisibleArea.value?.getWest(),
    bottom: debouncedVisibleArea.value?.getSouth(),
    right: debouncedVisibleArea.value?.getEast(),
  })),
  immediate: false,
});
</script>
