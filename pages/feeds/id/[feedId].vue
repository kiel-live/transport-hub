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

      <h1 class="text-2xl font-bold mt-4 mb-4">{{ feed.provider }}</h1>

      <div class="flex w-full gap-4">
        <div class="flex flex-col w-1/2">
          <h2 class="text-xl font-bold">Location</h2>
          <p>Country: {{ countryCode }}</p>
          <p>Subdivision: {{ subdivisionName }}</p>
          <p>Municipality: {{ municipality }}</p>

          <div class="flex gap-2 mt-auto">
            <Button :to="feed.urls['direct_download']" target="_blank">Download Feed</Button>
            <Button :to="feed.urls['latest']" target="_blank">Download latest</Button>
            <Button :to="feed.urls['license']" target="_blank">License</Button>
          </div>
        </div>

        <div class="flex mx-auto max-w-96 h-96 w-1/2">
          <ClientOnly>
            <Map
              :center="[feed.location?.bounding_box?.maximum_longitude, feed.location?.bounding_box?.maximum_latitude]"
            />
          </ClientOnly>
        </div>
      </div>

      <details class="mt-4">
        <summary>Raw Feed</summary>

        <pre>{{ feed }}</pre>
      </details>
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
