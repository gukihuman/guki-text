<template lang="pug">

div(class="flex-1 overflow-y-auto")
  a(v-for="text in texts" :key="text.id" class="block text-gray-400 text-base py-2 px-2 transition-colors duration-200 hover:bg-[#343541] hover:text-white" @click="setActiveId(text.id)")
    p {{ text.id }}
  a(v-for="folder in folders" :key="folder" class="block text-white text-lg py-2 px-2 transition-colors duration-200 hover:bg-[#343541] hover:text-white" @click="setActiveId(0)")
    p {{ folder }}

</template>

<script setup lang="ts">
const folders = computed(() => states.folders)
const texts = computed(() => states.texts)

const setActiveId = (id: number) => (states.activeId = id)
</script>
