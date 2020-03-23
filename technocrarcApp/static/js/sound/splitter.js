function splitSound() {
    if (socket.readyState == WebSocket.OPEN) {
        socket.onopen()
    }

    if (songs.length == 1) {
        document.getElementById("aiSplitterPreloader").classList.remove("hide")
        songID = songs[0].id

        socket.send(
            JSON.stringify({
                'song_id': songID,
                'stems': '5_stems',
            })
        )
        M.toast({ html: "Split in progress" })
    }
    else {
        M.toast({ html: "This song has already been splitted" })
    }
    // stems = 5,4,2
    // stems = '2_stems'
}

socket = new WebSocket('ws://' + window.location.host + '/ws/background-tasks/')
socket.onopen = function open(e) {
    console.log('WebSockets connection created.')
}

socket.onmessage = function onMessage(e) {
    let json_data = JSON.parse(e.data)
    globalSplitCounter++

    if (globalSplitCounter == 5) {
        M.toast({ html: "File splitted successfully." })
        document.getElementById("aiSplitterPreloader").className += " hide"
        prepareEditor(true)
        globalSplitCounter = 0
    }

}

socket.onclose = function onClose(e) {
}