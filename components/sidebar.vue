<template lang="pug">
div(class="h-screen min-w-[260px] h-full bg-gray-900 p-2 flex flex-col")
  new-links(v-if="loaded")
  p(v-if="!loaded" class="text-lg m-auto mt-3 italic text-gray-400") loading...
  links
  bottom-menu(v-if="loaded")
</template>
<script setup lang="ts">
//
const loaded = computed(() => states.loaded)
//
</script>
