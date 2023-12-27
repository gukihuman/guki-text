<template lang="pug">
div(
    v-if="STATES.echo.settings_open"
    class="absolute w-full h-full flex items-center justify-center bg-gray-800/50"
)
    div( class="w-[700px] h-[160px] bg-slate-800 rounded-xl border-white/20 border-4 flex flex-col" )
        input(
            ref="input"
            class="bg-gray-400 focus:outline-none rounded-md w-[640px] h-[50px] ml-[25px] mt-[20px] text-[22px] text-gray-900 px-[20px]"
            @input="handle_input()"
        )
        button(
            mark="api"
            ref="button"
            class="mt-[22px] ml-[292px] w-[100px] h-[40px] font-bold text-gray-300 text-md py-2 px-2 transition-colors duration-200 bg-gray-600 hover:bg-gray-500 hover:text-white rounded-md"
            @click="STATES.echo.settings_open = false"
        )
            p( class="ml-[-5px] mt-[-3px]" ) Confirm
</template>
<script setup lang="ts">
const input: any = ref(null)
const handle_input = () => {
    STATES.echo.api_key = input.value.value
    STATES.saveToLocalStorage()
}
watch(
    () => STATES.echo.settings_open,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            nextTick(() => {
                if (input.value) input.value.value = STATES.echo.api_key
            })
        }
    },
    { immediate: true }
)
</script>
