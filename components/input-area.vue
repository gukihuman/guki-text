<template lang="pug">
div(class="flex justify-center w-full bg-gradient-to-b from-[#263242] to-gray-800 relative")
  div(class="relative p-2 bg-gray-700 flex justify-center w-full shadow-2xl max-w-[800px]")
    textarea(
      ref="textarea"
      class="px-10 pt-8 w-full h-full outline-none max-w-[800px] bg-gray-700 p-4 text-lg text-gray-100 resize-none scrollbar relative"
      v-model="activeItem.text"
      :readonly="readonly"
      @input="STATES.saveToLocalStorageDebounced"
    )
</template>

<script setup lang="ts">
const textarea: any = ref(null)

const activeItem = computed(() => {
    return (
        STATES.echo.items.find((item) => item.id === STATES.echo.activeId) || ""
    )
})

const readonly = computed(() => {
    let isReadonly = true
    if (STATES.echo.activeId) isReadonly = false
    if (
        STATES.echo.items.find(
            (item) =>
                item.id === STATES.echo.activeId &&
                STATES.echo.items.find(
                    (item) => item.id === STATES.echo.activeId
                ).type === "folder"
        )
    ) {
        isReadonly = true
    }
    return isReadonly
})
onMounted(() => {
    // watch programmatically changed input value like Voice In plugin
    setInterval(() => {
        if (textarea.value.value !== activeItem.value.text) {
            activeItem.value.text = textarea.value.value
            STATES.saveToLocalStorageDebounced()
        }
    }, 150)
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
