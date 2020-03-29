export class AISpleeter {

    constructor(pubSub) {
        let webSocketProtocol;
        if (location.protocol == 'https:') { webSocketProtocol = "wss" } else { webSocketProtocol = "wss" }
        this.pubSub = pubSub
        this.socket = new WebSocket(webSocketProtocol + '://' + window.location.host + '/ws/background-tasks/')
        this.splitCounter = 0
        this.songs = []
        this._bindEvent()
    }

    split() {
        // stems = 5,4,2
        // stems = '2_stems'
        if (this.socket.readyState == WebSocket.OPEN) {
            this.socket.onopen()
        }

        if (this.songs.length == 1) {
            document.getElementById("aiSplitterPreloader").classList.remove("hide")
            let songID = this.songs[0].id

            this.socket.send(
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
    }

    updateSongs(songs){
        this.songs = songs
    }

    _bindEvent() {
        this.socket.onopen = (e) => console.log('WebSockets connection created.')

        this.socket.onmessage = (e) => {
            let json_data = JSON.parse(e.data)
            this.splitCounter++

            if (this.splitCounter == 5) {
                M.toast({ html: "File splitted successfully." })
                document.getElementById("aiSplitterPreloader").className += " hide"
                this.pubSub.publish("songSplitted", null)
                this.splitCounter = 0
            }

        }

        this.socket.onclose = (e) => console.log(e)

        let aiSplitMenu = document.getElementById("aiSplitMenu")
        aiSplitMenu.addEventListener("click", () => this.split())
    }
}