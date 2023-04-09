<template lang="pug">

div(
  class="flex-1 overflow-y-auto mt-1"
  ref="list"
  @dragover="handleDragOver($event)"
  @drop="handleDropEnd($event)"
)
  button(
    v-for="item in items"
    :key="item.id"
    :id="item.id"
    class="w-full text-gray-300 text-md py-2 px-2 transition-colors duration-200 hover:bg-gray-800 hover:text-white rounded-md hidden items-center "
    :class="{'hidden': item.type === 'root', 'bg-gray-700 hover:bg-gray-700': item.id === states.activeId}"
    @click="handleClick(item, $event)"
    :style="styleButton(item)"

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
    p(
      v-if="(!isRemoveConfirm && !isRenameConfirm) || item.id !== states.activeId" class="text-start overflow-hidden"
      :style="styleName(item)"
    ) {{ item.name }}
    
    svg-edit(
      class="ml-auto mr-1 scale-[.65] text-gray-500 hover:text-white rounded-md"
      @click="handleClickOnEdit(item)"
      v-if="(!isRemoveConfirm && !isRenameConfirm) || item.id !== states.activeId"
    )

    svg-remove(
      class="scale-75 text-gray-500 hover:text-white rounded-md"
      @click="handleClickOnRemove(item)"
      v-if="(!isRemoveConfirm && !isRenameConfirm) || item.id !== states.activeId"
    )

    p(v-if="isRemoveConfirm && item.id === states.activeId" class="italic") Are you sure?

    input(
      v-if="isRenameConfirm && item.id === states.activeId"
      class="link-name text-gray-300 bg-transparent border-none border-b-2 border-gray-300 hover:border-gray-400 focus:outline-none focus:border-blue-500"
      :style="styleName(item)"
      :value="states.items.find(item => item.id === states.activeId).name"
      @input="states.items.find(item => item.id === states.activeId).name = $event.target.value"
    )

    svg-ok(
      v-if="(isRemoveConfirm || isRenameConfirm) && item.id === states.activeId"
      class="ml-auto mr-1 scale-[.65] text-gray-400 hover:text-white rounded-md"
      @click="handleClickOnOk(item)"
    )
    svg-cancel(
      v-if="(isRemoveConfirm || isRenameConfirm) && item.id === states.activeId"
      class="scale-75 text-gray-400 hover:text-white rounded-md"
      @click="handleClickOnCancel(item)"
    )
</template>

<script setup lang="ts">
const list: any = ref(null)
const isRemoveConfirm = ref(false)
const isRenameConfirm = ref(false)
let tempName = ""
let tempId = 0
const styleButton = computed(() => {
  return (item) => {
    return {
      paddingLeft: item.layer * 10 + "px",
    }
  }
})
const styleName = computed(() => {
  return (item) => {
    return {
      width: 140 - item.layer * 10 + "px",
    }
  }
})

const handleClickOnCancel = () => {
  const item = states.items.find((item) => item.id === tempId)
  if (isRenameConfirm.value) item.name = tempName
  isRemoveConfirm.value = false
  isRenameConfirm.value = false
  if (item.type === "folder") states.activeId = 0
  document.removeEventListener("click", handleClickOutside)
}

const handleClickOnRemove = (item) => {
  setTimeout(() => {
    isRemoveConfirm.value = true
    states.activeId = item.id
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside)
    }, 0)
  }, 0)
}

const handleClickOnEdit = (item) => {
  if (isRenameConfirm.value) handleClickOnCancel()
  setTimeout(() => {
    tempName = item.name
    tempId = item.id
    isRenameConfirm.value = true
    states.activeId = item.id
    const button: any = document.getElementById(item.id)
    setTimeout(() => {
      const input = button.querySelector("input")
      if (input) {
        input.focus()
        input.select()
      }
      document.addEventListener("click", handleClickOutside)
    }, 0)
  }, 0)
}

const handleClickOutside = (event) => {
  const button = document.getElementById(_.toString(states.activeId))
  if (button && !button.contains(event.target)) {
    handleClickOnCancel()
  }
}

const handleClickOnOk = (item) => {
  if (isRemoveConfirm.value) {
    states.removeItem(item.id)
    setTimeout(() => {
      states.activeId = 0
      states.saveToLocalStorage()
    }, 0)
  }
  isRemoveConfirm.value = false
  isRenameConfirm.value = false
  states.saveToLocalStorage()
  if (item.type === "folder") states.activeId = 0
}
//
const items = computed(() => states.items)

const handleDragStart = (id: number, event: DragEvent) => {
  isRenameConfirm.value = false
  isRemoveConfirm.value = false
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
  let toItemIndex = states.items.findIndex((item) => item.id === toItemId)
  if (
    fromItemIndex === -1 ||
    toItemIndex === -1 ||
    fromItemIndex === toItemIndex
  ) {
    return
  }

  const draggedItem = states.items.find((item) => item.id === fromItemId)
  const dropItem = states.items.find((item) => item.id === toItemId)

  let stop = false
  const dragOnChild = (draggedItem) => {
    states.getChildren(draggedItem.id).forEach((child) => {
      if (child.type === "folder") dragOnChild(child)
      if (child.id === dropItem.id) stop = true
    })
  }
  dragOnChild(draggedItem)
  if (stop) return

  const [removedItem] = states.items.splice(fromItemIndex, 1)

  if (toItemId === -1) {
    states.items.push(removedItem)
    draggedItem.parent = 0
    toItemIndex = states.items.length() - 1
  } else if (dropItem.type === "text") {
    states.items.splice(toItemIndex, 0, removedItem)
    draggedItem.parent = dropItem.parent
    draggedItem.layer = dropItem.layer
  } else if (dropItem.type === "folder") {
    draggedItem.parent = dropItem.id
    const parentIndex = states.items.findIndex(
      (p) => p.id === draggedItem.parent
    )
    draggedItem.layer = dropItem.layer + 1
    states.items.splice(parentIndex + 1, 0, removedItem)
    if (!dropItem.opened) states.closeFolder(dropItem)
  }
  let indexOffset = 1
  function moveItem(movedItem) {
    const parentIndex = states.items.findIndex(
      (item) => item.id === movedItem.id
    )

    if (movedItem.type === "folder") {
      const children = states.getChildren(movedItem.id)
      children.forEach((child) => {
        if (fromItemIndex < toItemIndex) {
          indexOffset = 0
        }

        const childIndex = states.items.findIndex(
          (item) => item.id === child.id
        )
        const [removedChild] = states.items.splice(childIndex, 1)
        states.items.splice(parentIndex + indexOffset, 0, removedChild)
        child.layer = movedItem.layer + 1
        indexOffset++

        if (child.type === "folder") {
          const saveOffset = indexOffset
          indexOffset = 1
          moveItem(child)
          indexOffset += saveOffset - 1
        }
      })
    }
  }
  moveItem(draggedItem)

  states.saveToLocalStorage()
}

const handleDropEnd = (event: DragEvent) => {
  event.preventDefault()
  const target = event.target as HTMLElement
  if (target !== list.value) return
  const fromItemId = parseInt(event.dataTransfer?.getData("text/plain") || "")
  if (isNaN(fromItemId)) return
  const fromItemIndex = states.items.findIndex((item) => item.id === fromItemId)
  const toItemIndex = states.items.length - 1
  if (fromItemIndex === -1) return
  states.items.push(states.items[fromItemIndex])
  states.items.splice(fromItemIndex, 1)
  const draggedItem = states.items.find((item) => item.id === fromItemId)
  draggedItem.parent = 0
  draggedItem.layer = 0
  function moveItem(movedItem) {
    const parentIndex = states.items.findIndex(
      (item) => item.id === movedItem.id
    )

    if (movedItem.type === "folder") {
      let indexOffset = 1
      const children = states.getChildren(movedItem.id)
      children.forEach((child) => {
        if (fromItemIndex < toItemIndex) {
          indexOffset = 0
        }
        const childIndex = states.items.findIndex(
          (item) => item.id === child.id
        )
        const [removedChild] = states.items.splice(childIndex, 1)
        states.items.splice(parentIndex + indexOffset, 0, removedChild)
        child.layer = movedItem.layer + 1
        indexOffset++

        if (child.type === "folder") {
          moveItem(child)
        }
      })
    }
  }
  moveItem(draggedItem)
  states.saveToLocalStorage()
}

const handleClick = (item, event) => {
  if (item.type === "text") {
    states.activeId = item.id
  } else if (
    item.type === "folder" &&
    (event.target.nodeName === "BUTTON" || event.target.nodeName === "P")
  ) {
    item.opened = !item.opened
    if (item.opened) {
      states.updateFolderChildrenStyle(item)
    } else {
      states.closeFolder(item)
    }
  }
  states.saveToLocalStorage()
}

const handleKeyPress = (event) => {
  if (event.key === "Enter" && isRenameConfirm.value) {
    isRenameConfirm.value = false
    const item = states.items.find((item) => item.id === states.activeId)
    if (item.type === "folder") states.activeId = 0
    states.saveToLocalStorage()
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeyPress)
})
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress)
})
</script>
<style>
.link-name::selection {
  background-color: #657998;
}
</style>
