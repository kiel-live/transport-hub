<template>
  <div class="p-4">
    <Breadcrumbs :parts="[{ name: 'Feeds', to: '/feeds' }, { name: countryCode }]" />

    <table class="w-full">
      <tr class="border-b-2 text-left">
        <th>Name</th>
        <th>Feeds</th>
      </tr>
      <tr v-for="[name, amount] in feedAmounts" :key="name">
        <td>
          <nuxt-link :to="`/feeds/${countryCode}/${name}`" class="underline">{{ name }}</nuxt-link>
        </td>
        <td>{{ amount }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { FeedMeta } from '~/types/feed';

const route = useRoute();
const countryCode = computed(() => route.params.countryCode as string);
const { data: feeds } = await useFetch(`/api/feeds`);

function getAmounts<T extends Object>(items: T[], getAmountKey: (item: T) => string) {
  let amounts = items.reduce((acc, item) => {
    const key = getAmountKey(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const amountsArray = Object.entries(amounts);
  amountsArray.sort((a, b) => b[1] - a[1]);
  return amountsArray;
}

const feedAmounts = computed(() => {
  const filteredFeeds = ((feeds.value || []) as FeedMeta[]).filter(
    (i) => (i.location?.country_code || 'unknown') === countryCode.value,
  );
  return getAmounts(filteredFeeds, (i) => i.location?.subdivision_name || 'unknown');
});
</script>
