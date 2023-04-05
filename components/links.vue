<template lang="pug">
div(class="flex-1 overflow-y-auto")
  a(class="block text-white text-lg font-bold py-2" @click="setActiveId(0)") All
  hr(class="border-2 border-slate-800 my-4")
  a(v-for="folder in folders" :key="folder" class="block text-white text-lg py-2" @click="setActiveId(0)") {{ folder }}
  a(v-for="text in texts" :key="text.id" class="block text-gray-400 text-base py-2" @click="setActiveId(text.id)") {{ text.id }}
</template>

<script setup lang="ts">
const folders = computed(() => states.folders)
const texts = computed(() => states.texts)

const setActiveId = (id: number) => (states.activeId = id)
</script>
