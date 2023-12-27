<template lang="pug">
div
    button(
        mark="api"
        ref="button"
        class="w-full text-gray-300 text-md py-2 px-2 transition-colors duration-200 hover:bg-gray-800 hover:text-white rounded-md flex items-center"
        @click="STATES.echo.settings_open = true"
    )
        svg-settings( class="mr-2 scale-75")
        p API key

    button(
        mark="remove"
        ref="button"
        class="w-full text-gray-300 text-md py-2 px-2 transition-colors duration-200 hover:bg-gray-800 hover:text-white rounded-md flex items-center"
        @click="confirmOn()"
    )
        svg-remove( class="mr-2 scale-75")
        p(v-if="!isConfirm") Remove all

        p(v-if="isConfirm" class="italic") Are you sure?
        svg-ok(
            v-if="isConfirm"
            class="ml-auto mr-1 scale-[.65] text-gray-400 hover:text-white rounded-md"
            @click="removeAll(); confirmOff(); saveToLocalStorage()"
        )
        svg-cancel(
            v-if="isConfirm"
            class="scale-75 text-gray-400 hover:text-white rounded-md"
            @click="confirmOff()"
        )
    div(class="flex items-center gap-2 mb-2 mt-2")
        button(
            class="flex-1 border border-gray-700 rounded-md py-2 px-2 bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 flex items-center"
            @click="save"
        )
            p(class="ml-[30px]") Save
        button(
            class="flex-1 border border-gray-700 rounded-md py-2 px-2 bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 flex items-center"
            @click="load"
        )
            p(class="ml-[30px]") Load
</template>
<script setup lang="ts">
const save = () => {
    const save = {
        items: STATES.echo.items,
        idCounter: STATES.echo.idCounter,
        activeId: STATES.echo.activeId,
    }
    const stringified_save = JSON.stringify(save)
    const blob = new Blob([stringified_save], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    let a: any = document.createElement("a")
    document.body.appendChild(a)
    a.style = "display: none"
    a.href = url
    let date = new Date()
    let dateString = date.toISOString().slice(0, 10) // YYYY-MM-DD
    a.download = `guki-text-save-${dateString}.json`
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
}
const load = () => {
    // Create a file input element
    let fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.style.display = "none" // Hide the file input element

    // Add an event listener that will handle the file once it's selected
    fileInput.onchange = (event) => {
        const file = event.target.files[0] // Get the selected file
        if (file) {
            let reader = new FileReader()
            reader.onload = (e) => {
                try {
                    // Parse JSON content and assign it to STATES.echo.items
                    const save = JSON.parse(e.target.result)
                    STATES.loadFromLocalStorage(save)
                } catch (error) {
                    // Handle JSON parsing error
                    console.error("Error parsing JSON:", error)
                }
            }
            reader.readAsText(file) // Read the file as text
        }
    }

    // Append the file input to the DOM to make it clickable
    document.body.appendChild(fileInput)

    // Trigger the file dialog
    fileInput.click()

    // After clicking, remove the file input from the DOM
    fileInput.remove()

    STATES.saveToLocalStorage()
}
const button: any = ref(null)
const isConfirm = ref(false)
const confirmOff = () => {
    if (isConfirm.value) isConfirm.value = false
}
const confirmOn = () => {
    if (!isConfirm.value) {
        isConfirm.value = true
        document.addEventListener("click", handleClickOutside)
    }
}
const removeAll = () => {
    STATES.removeAllItems()
}
const saveToLocalStorage = () => {
    STATES.saveToLocalStorage()
}
const handleClickOutside = (event: MouseEvent) => {
    if (button && !button.value.contains(event.target)) {
        document.removeEventListener("click", handleClickOutside)
        confirmOff()
    }
}
</script>
