<template>
  <div class="h-full flex flex-col">
    <nav class="flex w-full bg-blue-700 text-white shadow-md p-2 gap-8 items-center">
      <div>
        <nuxt-link to="/" class="hover:underline">Transport Hub</nuxt-link>
      </div>
      <div class="flex gap-4">
        <nuxt-link to="/map" class="hover:underline">Map</nuxt-link>
        <nuxt-link to="/feeds" class="hover:underline">Feeds</nuxt-link>
        <nuxt-link to="https://github.com/kiel-live/transport-hub" target="_blank" class="hover:underline"
          >Source</nuxt-link
        >
      </div>

      <FormText class="ml-auto" placeholder="Search operator, feeds, ..." />
    </nav>

    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  @apply font-bold;
}
</style>

<style>
html,
body,
#__nuxt {
  @apply h-full;
}
</style>
