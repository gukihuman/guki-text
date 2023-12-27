class States {
    echo = {
        items: [
            {
                id: 0,
                type: "root",
                name: "root",
                parent: -1,
                opened: true,
                text: "",
                layer: 0,
            },
        ],
        idCounter: 0,
        activeId: 0,
        loaded: false,
        settings_open: false,
        api_key: "",
        recording_on: false,
        wait_for_transcript: false,
    }
    public newItem(type: "text" | "folder", name?: string, parent_id?: number) {
        const newId = this.echo.idCounter + 1
        const newItem = {
            id: newId,
            type,
            name: "New " + type,
            parent: 0,
            opened: true,
            text: "",
            layer: 0,
        }
        if (name) newItem.name = name
        if (parent_id) newItem.parent = parent_id
        this.echo.items.push(newItem)
        this.echo.idCounter = newId
        if (type === "text") this.echo.activeId = newId
        setTimeout(() => {
            const element = document.getElementById(newId)
            if (element) element.style.display = "flex"
        }, 0)
        return newItem
    }
    public removeItem(id: number) {
        const item = STATES.echo.items.find((item) => item.id === id)
        if (item.type === "folder") {
            STATES.getChildren(item.id).forEach((child) =>
                STATES.removeItem(child.id)
            )
        }
        const index = this.echo.items.findIndex((item) => item.id === id)
        if (index !== -1) this.echo.items.splice(index, 1)
    }
    public updateItem(id: number, newName: string) {
        const index = this.echo.items.findIndex((item) => item.id === id)
        if (index !== -1) this.echo.items[index].name = newName
    }
    public updateItemParent(id: number, newParent: string) {
        const index = this.echo.items.findIndex((item) => item.id === id)
        if (index !== -1) this.echo.items[index].parent = newParent
    }
    public toggleItemOpened(id: number) {
        const index = this.echo.items.findIndex((item) => item.id === id)
        if (index !== -1)
            this.echo.items[index].opened = !this.echo.items[index].opened
    }
    public getChildren(parentId: number) {
        const children = this.echo.items.filter(
            (item) => item.parent === parentId
        )
        return children
    }
    public removeAllItems() {
        this.echo.items = [
            {
                id: 0,
                type: "root",
                name: "root",
                parent: -1,
                opened: true,
                text: "",
                layer: 0,
            },
        ]
        this.echo.idCounter = 0
        this.echo.activeId = 0
    }
    public saveToLocalStorage() {
        const save = {
            items: this.echo.items,
            idCounter: this.echo.idCounter,
            activeId: this.echo.activeId,
            api_key: this.echo.api_key,
        }
        if (this.echo.loaded) {
            localStorage.setItem("guki-text-save", JSON.stringify(save))
        }
    }
    public saveToLocalStorageDebounced = _.debounce(
        this.saveToLocalStorage,
        200
    )
    public loadFromLocalStorage(save?: AnyObject) {
        let savedStates: any = localStorage.getItem("guki-text-save")
        if (savedStates !== null && save === undefined) {
            savedStates = JSON.parse(savedStates)
            this.echo.items = savedStates.items
            this.echo.idCounter = savedStates.idCounter
            this.echo.activeId = savedStates.activeId
            this.echo.api_key = savedStates.api_key
        }
        if (save) {
            this.echo.items = save.items
            this.echo.idCounter = save.idCounter
            this.echo.activeId = save.activeId
            this.saveToLocalStorage()
        }

        this.echo.loaded = true

        setTimeout(() => {
            STATES.echo.items.forEach((item) => {
                const element = document.getElementById(item.id)
                if (element && item.type !== "root")
                    element.style.display = "flex"
            })
            STATES.getChildren(0).forEach((item) => {
                if (item.type === "folder" && item.opened) {
                    this.updateFolderChildrenStyle(item)
                } else if (item.type === "folder") {
                    this.closeFolder(item)
                }
            })
        }, 0)
    }
    public closeFolder = (item) => {
        STATES.getChildren(item.id).forEach((child) => {
            if (child.type === "folder") this.closeFolder(child)
            if (child.id === STATES.echo.activeId) STATES.echo.activeId = 0
            const element = document.getElementById(child.id)
            if (element) element.style.display = "none"
        })
    }
    public updateFolderChildrenStyle = (item) => {
        if (!item.opened) {
            STATES.getChildren(item.id).forEach((child) => {
                if (child.id === STATES.echo.activeId) STATES.echo.activeId = 0
                const element = document.getElementById(child.id)
                if (element) element.style.display = "none"
            })
        } else {
            STATES.getChildren(item.id).forEach((child) => {
                if (child.type === "folder") {
                    const element = document.getElementById(child.id)
                    if (element) element.style.display = "flex"
                    this.updateFolderChildrenStyle(child)
                } else {
                    const element = document.getElementById(child.id)
                    if (element) element.style.display = "flex"
                }
            })
        }
    }
}
export const STATES = LIBRARY.resonate(new States())
