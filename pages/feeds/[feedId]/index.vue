<template>
  <div class="p-4">
    <template v-if="feed">
      <Breadcrumbs
        :parts="[
          { name: 'Feeds', to: '/feeds' },
          // { name: countryCode, to: `/feeds/${countryCode}` },
          // {
          //   name: subdivisionName,
          //   to: `/feeds/${countryCode}/${subdivisionName}`,
          // },
          // {
          //   name: municipality,
          //   to: `/feeds/${countryCode}/${subdivisionName}/${municipality}`,
          // },
          {
            name: feed.name,
          },
        ]"
      />

      <h1 class="text-2xl font-bold mt-4 mb-4">{{ feed.name }}</h1>

      <div class="flex w-full gap-4">
        <div class="flex flex-col w-1/2">
          <h2 class="text-xl font-bold">Details</h2>
          <!-- <p>Country: {{ countryCode }}</p>
          <p>Subdivision: {{ subdivisionName }}</p>
          <p>Municipality: {{ municipality }}</p> -->
          <p>Type: {{ feed.type }}</p>
          <p>Source url: {{ feed.url }}</p>
          <p>Last update: {{ feed.lastUpdated ? formatDateTime(feed.lastUpdated) : '---' }}</p>
          <p v-if="feed.contact">{{ feed.contact }}</p>

          <div class="flex gap-2 mt-auto">
            <Button :to="feed.url" target="_blank">Download Feed</Button>
            <Button :to="`/feeds/${feed.id}/logs`">Open Logs</Button>
            <!-- <Button :to="feed.urls['latest']" target="_blank">Download latest</Button>
            <Button :to="feed.urls['license']" target="_blank">License</Button> -->
          </div>
        </div>

        <div class="flex mx-auto max-w-96 h-96 w-1/2">
          <ClientOnly>
            <Map />
          </ClientOnly>
        </div>
      </div>

      <details class="mt-8">
        <summary>Raw Feed</summary>

        <pre>{{ feed }}</pre>
      </details>
    </template>
    <p v-else>Not found</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const feedId = computed(() => route.params.feedId as string);
const { data: feed } = await useFetch(`/api/feeds/${feedId.value}`);
</script>
