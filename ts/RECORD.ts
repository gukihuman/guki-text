class Record {
    media_recorder
    async init() {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        })
        this.media_recorder = new MediaRecorder(stream)
        this.media_recorder.ondataavailable = async (e) => {
            // this.download(e) // for testing purposes
            STATES.echo.wait_for_transcript = true
            let no_error = true
            const res: any = await this.send_whisper(e.data).catch((err) => {
                no_error = false
                console.log(err.message)
            })
            STATES.echo.wait_for_transcript = false
            if (no_error && res.text) {
                this.save_record(res.text)
                console.log(res.text)
                navigator.clipboard.writeText(res.text)
            }
        }
    }
    save_record(text) {
        let recording_folder = STATES.echo.items.find(
            (item) => item.name === "Recordings" && item.type === "folder"
        )
        if (!recording_folder) {
            recording_folder = STATES.newItem("folder", "Recordings")
        }
        const date = new Date()
        const name = date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Set to false for 24-hour time format
        })
        const new_item = STATES.newItem("text", name, recording_folder.id)
        new_item.text = text
        DROP.handleDrop(recording_folder.id, undefined, new_item.id)
    }
    send_whisper(blobData) {
        return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append("file", blobData, "recording.webm")
            formData.append("model", "whisper-1")
            formData.append("language", "en")
            const key = STATES.echo.api_key
            fetch("https://api.openai.com/v1/audio/transcriptions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${key}`,
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        reject(data.error)
                    } else {
                        resolve(data)
                    }
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    start = async () => {
        console.log("Recording...")
        this.media_recorder.start()
        STATES.echo.recording_on = true
    }
    stop = async () => {
        console.log("Stop recording. Waiting for transcript...")
        this.media_recorder.stop()
        STATES.echo.recording_on = false
    }
    download = (event) => {
        if (event.data.size > 0) {
            // Create a blob URL from the data
            let url = URL.createObjectURL(event.data)

            // Create an anchor element and trigger a download
            let a: any = document.createElement("a")
            document.body.appendChild(a)
            a.style = "display: none"
            a.href = url
            a.download = "recording.webm"
            a.click()

            // Clean up the URL object and remove the anchor element after the download
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        }
    }
}
export const RECORD = new Record()
