<template>
  <div class="p-4">
    <Breadcrumbs
      :parts="[
        { name: 'Feeds', to: '/feeds' },
        { name: countryCode, to: `/feeds/${countryCode}` },
        { name: subdivisionName, to: `/feeds/${countryCode}/${subdivisionName}` },
        { name: municipality },
      ]"
    />

    <table class="w-full">
      <tr class="border-b-2 text-left">
        <th>Provider</th>
        <th>Location</th>
      </tr>
      <tr v-for="feed in filteredFeeds" :key="feed.mdb_source_id">
        <td>
          <nuxt-link :to="`/feeds/id/${feed.mdb_source_id}`" class="underline">{{ truncate(feed.provider) }}</nuxt-link>
        </td>
        <td>{{ getFeedLocation(feed) }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '~/components/Breadcrumbs.vue';
import type { FeedMeta } from '~/types/feed';

const route = useRoute();
const countryCode = computed(() => route.params.countryCode as string);
const subdivisionName = computed(() => route.params.subdivisionName as string);
const municipality = computed(() => route.params.municipality as string);
const { data: feeds } = await useFetch(`/api/feeds`);

const filteredFeeds = computed(() =>
  ((feeds.value || []) as FeedMeta[]).filter(
    (i) =>
      (i.location?.country_code || 'unknown') === countryCode.value &&
      (i.location?.subdivision_name || 'unknown') === subdivisionName.value &&
      (i.location?.municipality || 'unknown') === municipality.value,
  ),
);

function getFeedLocation(feed: FeedMeta) {
  if (!feed.location) return 'unknown';

  return `${feed.location.municipality || 'unknown'}, ${feed.location.country_code || 'unknown'}`;
}
</script>
