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
    :class="{'hidden': item.type === 'root', 'bg-gray-700 hover:bg-gray-700': item.id === STATES.echo.activeId}"
    @click="handleClick(item, $event)"
    :style="styleButton(item)"

    draggable="true"
    @dragstart="handleDragStart(item.id, $event)"
    @dragover="handleDragOver($event)"
    @dragenter="handleDragEnter(item.id, $event)"
    @dragleave="handleDragLeave(item.id, $event)"
    @drop="DROP.handleDrop(item.id, $event)"
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
      v-if="(!isRemoveConfirm && !isRenameConfirm) || item.id !== STATES.echo.activeId" class="text-start overflow-hidden"
      :style="styleName(item)"
    ) {{ item.name }}
    
    svg-edit(
      class="ml-auto mr-1 scale-[.65] text-gray-500 hover:text-white rounded-md"
      @click="handleClickOnEdit(item)"
      v-if="(!isRemoveConfirm && !isRenameConfirm) || item.id !== STATES.echo.activeId"
    )

    svg-remove(
      class="scale-75 text-gray-500 hover:text-white rounded-md"
      @click="handleClickOnRemove(item)"
      v-if="(!isRemoveConfirm && !isRenameConfirm) || item.id !== STATES.echo.activeId"
    )

    p(v-if="isRemoveConfirm && item.id === STATES.echo.activeId" class="italic") Are you sure?

    input(
      v-if="isRenameConfirm && item.id === STATES.echo.activeId"
      class="link-name text-gray-300 bg-transparent border-none border-b-2 border-gray-300 hover:border-gray-400 focus:outline-none focus:border-blue-500"
      :style="styleName(item)"
      :value="STATES.echo.items.find(item => item.id === STATES.echo.activeId).name"
      @input="STATES.echo.items.find(item => item.id === STATES.echo.activeId).name = $event.target.value"
    )

    svg-ok(
      v-if="(isRemoveConfirm || isRenameConfirm) && item.id === STATES.echo.activeId"
      class="ml-auto mr-1 scale-[.65] text-gray-400 hover:text-white rounded-md"
      @click="handleClickOnOk(item)"
    )
    svg-cancel(
      v-if="(isRemoveConfirm || isRenameConfirm) && item.id === STATES.echo.activeId"
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
    const item = STATES.echo.items.find((item) => item.id === tempId)
    if (isRenameConfirm.value) item.name = tempName
    isRemoveConfirm.value = false
    isRenameConfirm.value = false
    if (item.type === "folder") STATES.echo.activeId = 0
    document.removeEventListener("click", handleClickOutside)
}

const handleClickOnRemove = (item) => {
    setTimeout(() => {
        isRemoveConfirm.value = true
        STATES.echo.activeId = item.id
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
        STATES.echo.activeId = item.id
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
    const button = document.getElementById(_.toString(STATES.echo.activeId))
    if (button && !button.contains(event.target)) {
        handleClickOnCancel()
    }
}

const handleClickOnOk = (item) => {
    if (isRemoveConfirm.value) {
        STATES.removeItem(item.id)
        setTimeout(() => {
            STATES.echo.activeId = 0
            STATES.saveToLocalStorage()
        }, 0)
    }
    isRemoveConfirm.value = false
    isRenameConfirm.value = false
    STATES.saveToLocalStorage()
    if (item.type === "folder") STATES.echo.activeId = 0
}
//
const items = computed(() => STATES.echo.items)

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
    const item = STATES.echo.items.find((item) => item.id === id)
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

const handleDropEnd = (event: DragEvent) => {
    event.preventDefault()
    const target = event.target as HTMLElement
    if (target !== list.value) return
    const fromItemId = parseInt(event.dataTransfer?.getData("text/plain") || "")
    if (isNaN(fromItemId)) return
    const fromItemIndex = STATES.echo.items.findIndex(
        (item) => item.id === fromItemId
    )
    const toItemIndex = STATES.echo.items.length - 1
    if (fromItemIndex === -1) return
    STATES.echo.items.push(STATES.echo.items[fromItemIndex])
    STATES.echo.items.splice(fromItemIndex, 1)
    const draggedItem = STATES.echo.items.find((item) => item.id === fromItemId)
    draggedItem.parent = 0
    draggedItem.layer = 0
    function moveItem(movedItem) {
        const parentIndex = STATES.echo.items.findIndex(
            (item) => item.id === movedItem.id
        )

        if (movedItem.type === "folder") {
            let indexOffset = 1
            const children = STATES.getChildren(movedItem.id)
            children.forEach((child) => {
                if (fromItemIndex < toItemIndex) {
                    indexOffset = 0
                }
                const childIndex = STATES.echo.items.findIndex(
                    (item) => item.id === child.id
                )
                const [removedChild] = STATES.echo.items.splice(childIndex, 1)
                STATES.echo.items.splice(
                    parentIndex + indexOffset,
                    0,
                    removedChild
                )
                child.layer = movedItem.layer + 1
                indexOffset++

                if (child.type === "folder") {
                    moveItem(child)
                }
            })
        }
    }
    moveItem(draggedItem)
    STATES.saveToLocalStorage()
}

const handleClick = (item, event) => {
    if (item.type === "text") {
        STATES.echo.activeId = item.id
    } else if (
        item.type === "folder" &&
        (event.target.nodeName === "BUTTON" || event.target.nodeName === "P")
    ) {
        item.opened = !item.opened
        if (item.opened) {
            STATES.updateFolderChildrenStyle(item)
        } else {
            STATES.closeFolder(item)
        }
    }
    STATES.saveToLocalStorage()
}

const handleKeyPress = (event) => {
    if (event.key === "Enter" && isRenameConfirm.value) {
        isRenameConfirm.value = false
        const item = STATES.echo.items.find(
            (item) => item.id === STATES.echo.activeId
        )
        if (item.type === "folder") STATES.echo.activeId = 0
        STATES.saveToLocalStorage()
    }
}

onMounted(() => {
    REFS.list = list
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
