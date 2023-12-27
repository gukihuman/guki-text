<template lang="pug">
div(class="flex flex-row bg-gray-700")
    sidebar
    input-area
    settings

    //- 📜 when texts are loaded
    //- transition(name="fast")
    //-   loading(v-if="!STATES.echo.loaded")
</template>
<script setup>
onMounted(async () => {
    await RECORD.init()
    STATES.loadFromLocalStorage()
})
</script>
<style>
/*
/* "fast" transition */
.fast-enter-active,
.fast-leave-active {
    transition: opacity 0.5s ease;
}

.fast-enter-from,
.fast-leave-to {
    opacity: 0;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: #2b333f;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background-color: #424f62;
}
::-webkit-scrollbar-corner {
    background-color: transparent;
}
::-webkit-scrollbar {
    width: 10px;
}
</style>
