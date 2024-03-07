<template>
  <div class="p-4">
    <Breadcrumbs :parts="[{ name: 'Feeds' }]" />

    <h1 class="text-2xl mb-4 mt-4">Feeds</h1>

    <table class="w-full">
      <tr class="border-b-2 text-left">
        <th>Country</th>
        <th>Feeds</th>
      </tr>
      <tr v-for="[country, amount] in countryAmounts" :key="country">
        <td>
          <nuxt-link :to="`/feeds/${country}`" class="underline">{{ country }}</nuxt-link>
        </td>
        <td>{{ amount }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { FeedMeta } from '~/types/feed';

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

const countryAmounts = computed(() => {
  const filteredFeeds = (feeds.value || []) as FeedMeta[];
  return getAmounts(filteredFeeds, (i) => i.location?.country_code || 'unknown');
});
</script>
