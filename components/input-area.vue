<template lang="pug">
div(class="flex justify-center w-full bg-gradient-to-b from-[#263242] to-gray-800 relative")
  div(class="relative p-2 bg-gray-700 flex justify-center w-full shadow-2xl max-w-[800px]")
    textarea(
      class="px-10 pt-8 w-full h-full outline-none max-w-[800px] bg-gray-700 p-4 text-lg text-gray-100 resize-none scrollbar relative"
      v-model.trim="activeItem.text"
      :readonly="readonly"
      @input="states.saveToLocalStorageDebounced"
    )
</template>

<script setup lang="ts">
const activeItem = computed(() => {
  return states.items.find((item) => item.id === states.activeId) || ""
})
const readonly = computed(() => {
  let isReadonly = true
  if (states.activeId) isReadonly = false
  if (
    states.items.find(
      (item) =>
        item.id === states.activeId &&
        states.items.find((item) => item.id === states.activeId).type ===
          "folder"
    )
  ) {
    isReadonly = true
  }
  return isReadonly
})
</script>
<style>
.scrollbar::-webkit-scrollbar-thumb {
  background-color: #48566b;
  border-radius: 10px;
}
.scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #53647d;
}
.scrollbar::selection {
  background-color: #657998;
}
</style>
