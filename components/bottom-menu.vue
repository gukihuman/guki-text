<template lang="pug">

div
  button(
    ref="button"
    class="w-full text-gray-300 text-md py-2 px-2 transition-colors duration-200 hover:bg-gray-800 hover:text-white rounded-md flex items-center"
    @click="confirmOn()"
  )
    svg-remove( class="mr-2 scale-75")
    p(v-if="!isConfirm") Remove all


    p(v-if="isConfirm" class="italic") Are you sure?
    svg-ok(
      v-if="isConfirm"
      class="ml-auto mr-1 scale-[.65] text-gray-400 hover:text-white rounded-md"
      @click="removeAll(); confirmOff(); saveToLocalStorage()"
    )
    svg-cancel(
      v-if="isConfirm"
      class="scale-75 text-gray-400 hover:text-white rounded-md"
      @click="confirmOff()"
    )


</template>

<script setup lang="ts">
//

const button: any = ref(null)

const isConfirm = ref(false)

const confirmOff = () => {
  if (isConfirm.value) isConfirm.value = false
}

const confirmOn = () => {
  if (!isConfirm.value) {
    isConfirm.value = true
    document.addEventListener("click", handleClickOutside)
  }
}

const removeAll = () => {
  states.removeAllItems()
}
const saveToLocalStorage = () => {
  states.saveToLocalStorage()
}

const handleClickOutside = (event: MouseEvent) => {
  if (button && !button.value.contains(event.target)) {
    document.removeEventListener("click", handleClickOutside)
    confirmOff()
  }
}
</script>
