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
    div(
        v-if="STATES.echo.wait_for_transcript"
        class="w-[50px] h-[40px] py-2 px-3 text-white ml-auto transition-all duration-200 pr-[10px] relative left-[-12px] top-[-14px]"
    )
        svg-loading-anim(class="scale-[.6]")

</template>
<script setup lang="ts">
const is_recording = computed(() => {
    return STATES.echo.recording_on
})
const newFolder = () => {
    STATES.newItem("folder")
    STATES.saveToLocalStorage()
}
const newText = () => {
    STATES.newItem("text")
    STATES.saveToLocalStorage()
}
</script>
