import { an } from "vitest/dist/types-2a26f28c"

class States {
  private _states = defineStore("states", {
    state: (): {
      [index: string]: any
    } => ({
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
    }),
  })

  public get items() {
    return this._states().items
  }

  public set items(items) {
    this._states().items = items
  }

  public get loaded() {
    return this._states().loaded
  }

  public get activeId() {
    return this._states().activeId
  }

  public set activeId(id: number) {
    this._states().activeId = id
  }

  public newItem(type: "text" | "folder") {
    const newId = this._states().idCounter + 1
    const newItem = {
      id: newId,
      type,
      name: "New " + type,
      parent: 0,
      opened: true,
      text: "",
      layer: 0,
    }
    this._states().items.push(newItem)
    this._states().idCounter = newId
    if (type === "text") this._states().activeId = newId
    setTimeout(() => {
      const element = document.getElementById(newId)
      if (element) element.style.display = "flex"
    }, 0)
  }

  public removeItem(id: number) {
    const item = states.items.find((item) => item.id === id)
    if (item.type === "folder") {
      states
        .getChildren(item.id)
        .forEach((child) => states.removeItem(child.id))
    }
    const index = this._states().items.findIndex((item) => item.id === id)
    if (index !== -1) this._states().items.splice(index, 1)
  }

  public updateItem(id: number, newName: string) {
    const index = this._states().items.findIndex((item) => item.id === id)
    if (index !== -1) this._states().items[index].name = newName
  }

  public updateItemParent(id: number, newParent: string) {
    const index = this._states().items.findIndex((item) => item.id === id)
    if (index !== -1) this._states().items[index].parent = newParent
  }

  public toggleItemOpened(id: number) {
    const index = this._states().items.findIndex((item) => item.id === id)
    if (index !== -1)
      this._states().items[index].opened = !this._states().items[index].opened
  }

  public getChildren(parentId: number) {
    const children = this._states().items.filter(
      (item) => item.parent === parentId
    )
    return children
  }

  public removeAllItems() {
    this._states().items = [
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
    this._states().idCounter = 0
    this._states().activeId = 0
  }

  public saveToLocalStorage() {
    if (this._states().loaded) {
      localStorage.setItem("states", JSON.stringify(this._states()))
    }
  }
  public saveToLocalStorageDebounced = _.debounce(this.saveToLocalStorage, 200)

  public loadFromLocalStorage() {
    let savedStates: any = localStorage.getItem("states")
    if (savedStates !== null) {
      savedStates = JSON.parse(savedStates)
      this._states().items = savedStates.items
      this._states().idCounter = savedStates.idCounter
      this._states().activeId = savedStates.activeId
    }
    this._states().loaded = true

    setTimeout(() => {
      states.items.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element && item.type !== "root") element.style.display = "flex"
      })
      states.getChildren(0).forEach((item) => {
        if (item.type === "folder" && item.opened) {
          this.updateFolderChildrenStyle(item)
        } else if (item.type === "folder") {
          this.closeFolder(item)
        }
      })
    }, 0)
  }

  public closeFolder = (item) => {
    states.getChildren(item.id).forEach((child) => {
      if (child.type === "folder") this.closeFolder(child)
      if (child.id === states.activeId) states.activeId = 0
      const element = document.getElementById(child.id)
      if (element) element.style.display = "none"
    })
  }
  public updateFolderChildrenStyle = (item) => {
    if (!item.opened) {
      states.getChildren(item.id).forEach((child) => {
        if (child.id === states.activeId) states.activeId = 0
        const element = document.getElementById(child.id)
        if (element) element.style.display = "none"
      })
    } else {
      states.getChildren(item.id).forEach((child) => {
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

export const states = new States()
