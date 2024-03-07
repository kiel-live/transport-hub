<template>
  <div class="p-4">
    <template v-if="feed">
      <Breadcrumbs
        :parts="[
          { name: 'Feeds', to: '/feeds' },
          { name: countryCode, to: `/feeds/${countryCode}` },
          {
            name: subdivisionName,
            to: `/feeds/${countryCode}/${subdivisionName}`,
          },
          {
            name: municipality,
            to: `/feeds/${countryCode}/${subdivisionName}/${municipality}`,
          },
          {
            name: feed.provider,
          },
        ]"
      />

      <pre>{{ feed }}</pre>
    </template>
    <p v-else>Not found</p>
  </div>
</template>

<script setup lang="ts">
import type { FeedMeta } from '~/types/feed';

const route = useRoute();
const feedId = computed(() => route.params.feedId as string);
const { data: feed } = await useFetch<FeedMeta>(`/api/feeds/${feedId.value}`);

const countryCode = computed(() => feed.value?.location?.country_code || 'unknown');
const subdivisionName = computed(() => feed.value?.location?.subdivision_name || 'unknown');
const municipality = computed(() => feed.value?.location?.municipality || 'unknown');
</script>
