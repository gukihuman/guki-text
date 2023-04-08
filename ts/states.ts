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
          parent: 0,
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
    this._states().activeId = newId
  }

  public removeItem(id: number) {
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

  public getChildren(parent: string) {
    return this._states().items.filter((item) => item.parent === parent)
  }

  public removeAllItems() {
    this._states().items = [
      {
        id: 0,
        type: "root",
        name: "root",
        parent: "",
        opened: true,
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
  }
}

export const states = new States()
