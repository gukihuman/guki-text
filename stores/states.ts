class States {
  private _states = defineStore("states", {
    state: (): {
      [index: string]: any
    } => ({
      folders: [],
      texts: [],
      idCounter: 0,
      activeId: 0,
    }),
  })
  public get folders() {
    return this._states().folders
  }
  public get texts() {
    return this._states().texts
  }
  public get activeId() {
    return this._states().activeId
  }
  public set activeId(id: number) {
    this._states().activeId = id
  }
  public newFolder() {
    let newFolderName = "New Folder"
    let folderExists = true
    let suffix = 1

    while (folderExists) {
      if (this._states().folders.includes(newFolderName)) {
        newFolderName = `New Folder ${suffix}`
        suffix++
      } else {
        folderExists = false
      }
    }
    this._states().folders.push(newFolderName)
  }
  public newText() {
    const newId = this._states().idCounter + 1
    const newText = { id: newId, text: "", folder: "" }
    this._states().texts.push(newText)
    this._states().idCounter = newId
  }
  public removeFolder(name: string) {
    const folderIndex = this._states().folders.indexOf(name)
    if (folderIndex === -1) return

    const textsToDelete = this._states().texts.filter(
      (text) => text.folder === name
    )
    textsToDelete.forEach((text) => {
      const index = this._states().texts.indexOf(text)
      if (index !== -1) this._states().texts.splice(index, 1)
    })
    this._states().folders.splice(folderIndex, 1)
  }
  public removeText(id: number) {
    const index = this._states().texts.findIndex((text) => text.id === id)
    if (index !== -1) this._states().texts.splice(index, 1)
  }
  public updateText(id: number, newText: string) {
    const index = this._states().texts.findIndex((text) => text.id === id)
    if (index !== -1) this._states().texts[index].text = newText
  }
}

export const states = new States()
