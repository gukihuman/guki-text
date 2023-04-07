<template lang="pug">

div(class="flex items-center gap-2 mb-2")
  button(
    class="flex-1 border border-gray-700 rounded-md py-2 px-2 bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 flex items-center"
    @click="newText"
  )
    svg-plus(class="mr-2 scale-75")
    p New text
  button(class="border border-gray-700 rounded-md py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white ml-auto transition-all duration-200" @click="newFolder")
    svg-folder-plus(class="scale-[.9]")

</template>

<script setup lang="ts">
//
const newFolder = () => {
  states.newItem("folder")
}
const newText = () => {
  states.newItem("text")
}
</script>
