<template lang="pug">

div(
  class="flex-1 overflow-y-auto"
  ref="list"
  @dragover="handleDragOver($event)"
  @drop="handleDropEnd($event)"
)
  button(
    v-for="item in items"
    :key="item.id"
    class="w-full text-gray-300 text-md py-2 px-2 transition-colors duration-200 hover:bg-gray-800 hover:text-white rounded-md flex items-center "
    :class="{'hidden': item.type === 'root'}"
    @click="setActiveId(item.id)"
    draggable="true"
    @dragstart="handleDragStart(item.id, $event)"
    @dragover="handleDragOver($event)"
    @dragenter="handleDragEnter(item.id, $event)"
    @dragleave="handleDragLeave(item.id, $event)"
    @drop="handleDrop(item.id, $event)"
  )
    svg-chevron-right(
      v-if="item.type === 'folder' && !item.opened"
      class="mr-2 scale-75"
    )
    svg-chevron-down(
      v-if="item.type === 'folder' && item.opened"
      class="mr-2 scale-75"
    )
    svg-chat-bubble(
      v-if="item.type === 'text'"
      class="mr-2 scale-[.65]"
    )
    p {{ item.name }}

    svg-edit(
      class="ml-auto mr-1 scale-[.65] text-gray-500 hover:text-white rounded-md"
    )

    svg-remove(
      class="scale-75 text-gray-500 hover:text-white rounded-md"
    )
</template>

<script setup lang="ts">
const list: any = ref(null)
//
const items = computed(() => {
  return states.items
})

const handleDragStart = (id: number, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", id.toString())
    event.dataTransfer.effectAllowed = "move"
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move"
  }
}

const classList = ["bg-gray-500", "bg-opacity-50", "backdrop-blur-md"]

const handleDragEnter = (id, event) => {
  const item = states.items.find((item) => item.id === id)
  if (item.type !== "folder") return

  event.currentTarget.classList.add(...classList)

  const parent = event.target.parentNode
  if (parent.nodeName === "BUTTON") {
    setTimeout(() => {
      parent.classList.add(...classList)
    }, 0)
  }
}
const handleDragLeave = (id, event) => {
  const parent = event.target.parentNode
  if (parent.nodeName !== "BUTTON") {
    event.currentTarget.classList.remove(...classList)
  }
}

const handleDrop = (toItemId: number, event: DragEvent) => {
  _.forEach(list.value.children, (el) => el.classList.remove(...classList))
  event.preventDefault()
  const fromItemId = parseInt(event.dataTransfer?.getData("text/plain") || "")
  if (isNaN(fromItemId)) return
  const fromItemIndex = states.items.findIndex((item) => item.id === fromItemId)
  const toItemIndex = states.items.findIndex((item) => item.id === toItemId)
  if (
    fromItemIndex === -1 ||
    toItemIndex === -1 ||
    fromItemIndex === toItemIndex
  ) {
    return
  }
  const [removedItem] = states.items.splice(fromItemIndex, 1)
  if (toItemId === -1) {
    // append the item to the end of the list
    states.items.push(removedItem)
  } else {
    states.items.splice(toItemIndex, 0, removedItem)
  }
}
const handleDropEnd = (event: DragEvent) => {
  event.preventDefault()
  const target = event.target as HTMLElement
  if (target !== list.value) return
  const fromItemId = parseInt(event.dataTransfer?.getData("text/plain") || "")
  if (isNaN(fromItemId)) return
  const fromItemIndex = states.items.findIndex((item) => item.id === fromItemId)
  if (fromItemIndex === -1) return
  states.items.push(states.items[fromItemIndex])
  states.items.splice(fromItemIndex, 1)
}

const setActiveId = (id: number) => (states.activeId = id)
</script>
