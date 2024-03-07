<template>
  <div>
    <nav class="flex w-full bg-green-100 shadow-md mb-2 p-2 gap-8 items-center">
      <div>
        <nuxt-link to="/">Transport Hub</nuxt-link>
      </div>
      <div class="flex gap-4">
        <nuxt-link to="/map">Map</nuxt-link>
        <nuxt-link to="/feeds">Feeds</nuxt-link>
        <nuxt-link to="/api">API</nuxt-link>
      </div>

      <FormText class="ml-auto" placeholder="Search operator, feeds, ..." />
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  @apply font-bold;
}
</style>
