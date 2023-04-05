<template lang="pug">

sidebar

  //- 📜 when texts are loaded
  //- transition(name="fast")
  //-   loading(v-if="!States().allLoaded")

</template>

<script setup>
//
onMounted(() => {
  //
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

/* disable scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>
