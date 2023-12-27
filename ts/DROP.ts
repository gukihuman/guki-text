const classList = ["bg-gray-500", "bg-opacity-50", "backdrop-blur-md"]
class Drop {
    handleDrop = (
        toItemId: number,
        event?: DragEvent,
        from_item_id?: number
    ) => {
        _.forEach(REFS.list.value.children, (el) =>
            el.classList.remove(...classList)
        )
        if (event) event.preventDefault()
        let fromItemId: number
        if (from_item_id) {
            fromItemId = from_item_id
        } else if (!from_item_id && event) {
            fromItemId = parseInt(
                event.dataTransfer?.getData("text/plain") || ""
            )
        } else return
        if (isNaN(fromItemId)) return
        const fromItemIndex = STATES.echo.items.findIndex(
            (item) => item.id === fromItemId
        )
        let toItemIndex = STATES.echo.items.findIndex(
            (item) => item.id === toItemId
        )
        if (
            fromItemIndex === -1 ||
            toItemIndex === -1 ||
            fromItemIndex === toItemIndex
        ) {
            return
        }

        const draggedItem = STATES.echo.items.find(
            (item) => item.id === fromItemId
        )
        const dropItem = STATES.echo.items.find((item) => item.id === toItemId)

        let stop = false
        const dragOnChild = (draggedItem) => {
            STATES.getChildren(draggedItem.id).forEach((child) => {
                if (child.type === "folder") dragOnChild(child)
                if (child.id === dropItem.id) stop = true
            })
        }
        dragOnChild(draggedItem)
        if (stop) return

        const [removedItem] = STATES.echo.items.splice(fromItemIndex, 1)

        if (toItemId === -1) {
            STATES.echo.items.push(removedItem)
            draggedItem.parent = 0
            toItemIndex = STATES.echo.items.length() - 1
        } else if (dropItem.type === "text") {
            STATES.echo.items.splice(toItemIndex, 0, removedItem)
            draggedItem.parent = dropItem.parent
            draggedItem.layer = dropItem.layer
        } else if (dropItem.type === "folder") {
            draggedItem.parent = dropItem.id
            const parentIndex = STATES.echo.items.findIndex(
                (p) => p.id === draggedItem.parent
            )
            draggedItem.layer = dropItem.layer + 1
            STATES.echo.items.splice(parentIndex + 1, 0, removedItem)
            if (!dropItem.opened) STATES.closeFolder(dropItem)
        }
        let indexOffset = 1
        function moveItem(movedItem) {
            const parentIndex = STATES.echo.items.findIndex(
                (item) => item.id === movedItem.id
            )

            if (movedItem.type === "folder") {
                const children = STATES.getChildren(movedItem.id)
                children.forEach((child) => {
                    if (fromItemIndex < toItemIndex) {
                        indexOffset = 0
                    }

                    const childIndex = STATES.echo.items.findIndex(
                        (item) => item.id === child.id
                    )
                    const [removedChild] = STATES.echo.items.splice(
                        childIndex,
                        1
                    )
                    STATES.echo.items.splice(
                        parentIndex + indexOffset,
                        0,
                        removedChild
                    )
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
        STATES.saveToLocalStorage()
    }
}
export const DROP = new Drop()
