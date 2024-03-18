<template>
  <div class="p-4">
    <Breadcrumbs :parts="[{ name: 'Feeds' }]" />

    <h1 class="text-2xl mb-4 mt-4">Feeds</h1>

    <table class="w-full">
      <tr class="border-b-2 text-left">
        <th>Type</th>
        <th>Name</th>
        <th>Last update</th>
      </tr>
      <tr v-for="feed in feeds" :key="feed.id">
        <td>{{ feed.type }}</td>
        <td>
          <nuxt-link :to="`/feeds/${feed.id}`" class="underline">{{ feed.name }}</nuxt-link>
        </td>
        <td>{{ feed.lastUpdated ? formatDateTime(feed.lastUpdated) : '---' }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
const { data: feeds } = await useFetch(`/api/feeds`);
</script>
