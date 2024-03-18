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
            to: `/feeds/${feed.id}`,
          },
          {
            name: 'Logs',
          },
        ]"
      />

      <h1 class="text-2xl font-bold mt-4 mb-4">{{ feed.name }} - Logs</h1>

      <table class="w-full">
        <tr class="border-b border-gray-400">
          <th class="w-1/5">Date</th>
          <th class="w-4/5">Logs</th>
        </tr>
        <tr v-for="log in logs" class="border-t border-gray-300">
          <td>
            <span>{{ formatDateTime(log.createdAt) }}</span>
          </td>
          <td>
            <div class="flex flex-col">
              <span v-for="(line, i) in log.logs" :key="i">{{ line }}</span>
            </div>
          </td>
        </tr>
      </table>
    </template>
    <p v-else>Not found</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const feedId = computed(() => route.params.feedId as string);
const { data: feed } = await useFetch(`/api/feeds/${feedId.value}`);
const { data: logs } = await useFetch(`/api/feeds/${feedId.value}/logs`);
</script>
