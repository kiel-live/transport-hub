<template>
  <table class="w-full">
    <tr class="border-b-2 text-left">
      <th>Name</th>
      <th>Feeds</th>
    </tr>
    <tr v-for="feed in feeds" :key="feed.">
      <td>
        <nuxt-link :to="`/feeds/${feed.mdb_source_id}`" class="underline">{{ feed.mdb_source_id }}</nuxt-link>
      </td>
      <td class="min-w-0">
        <span class="truncate">{{ truncate(feed.provider) }}{{ feed.name ? ` (${feed.name})` : '' }}</span>
      </td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import type { FeedMeta } from '~/types/feed';

defineProps<{
  feeds: FeedMeta[];
}>();
</script>
