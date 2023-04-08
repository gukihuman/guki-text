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
          parent: "",
          opened: true,
        },
      ],
      idCounter: 0,
      activeId: 0,
    }),
  })

  public get items() {
    return this._states().items
  }

  public set items(items) {
    this._states().items = items
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
      parent: "root",
      opened: true,
    }
    this._states().items.push(newItem)
    this._states().idCounter = newId
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
}

export const states = new States()
