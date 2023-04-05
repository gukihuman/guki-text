<template lang="pug">
  div(class="flex items-center justify-between mb-8")
    h1(class="text-3xl font-bold text-white") Sidebar
    div
      button(class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-4" @click="newFolder") New Folder
      button(class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" @click="newText") New Text
</template>

<script setup lang="ts">
const newFolder = () => {
  states.newFolder()
}
const newText = () => {
  states.newText()
}
</script>
