import { OptionFormGenerator } from "/static/js/sound/effect/form/formGeneration.js"
import { FilterOption } from "/static/js/sound/effect/filters.js"
import { PannerOption, Position, Orientation } from "/static/js/sound/effect/panners.js"
import { SoundEffect } from "/static/js/sound/effect/effectManager.js"
import { sortByValue } from "/static/js/utils/utils.js"
import { EFFECTS } from "/static/js/sound/effect/options.js"

export class ProjectController {

    constructor() {
        this.waveArray = {}
        this.isPlayOn = false
        this.selectedTrack = 0
        this._bindEvents()
    }

    addRegion(waveSurfer, inRegionCb) {
        const currentTime = waveSurfer.getCurrentTime()

        waveSurfer.on("region-in", inRegionCb)
        waveSurfer.on("region-out", () => SoundEffect.removeFilter(waveSurfer))

        return waveSurfer.addRegion({
            "start": currentTime,
            "end": currentTime + 10
        })
    }

    applyFilter() {
        let freq = document.getElementById("frequency").value
        let gain = document.getElementById("gain").value
        let Q = document.getElementById("Q").value
        let type = document.getElementById("type").value

        let filterOption = new FilterOption(parseInt(freq), parseInt(gain), parseInt(Q), type)

        let waveSurfer = this.waveArray[this.selectedTrack]

        let region = this.addRegion(waveSurfer, () => SoundEffect.addFilter(waveSurfer, filterOption))
        region["effect"] = FilterOption.name
        region["effectOption"] = filterOption
    }

    applyPanner() {
        let waveSurfer = this.waveArray[this.selectedTrack]

        let coneOuterGain = document.getElementById("coneOuterGain").value
        let coneOuterAngle = document.getElementById("coneOuterAngle").value
        let coneInnerAngle = document.getElementById("coneInnerAngle").value

        let pannerOption = new PannerOption(coneOuterGain, coneOuterAngle, coneInnerAngle,
            new Position(5, 0, 0),
            new Orientation(90, 90, 0)
        )

        let region = this.addRegion(waveSurfer, () => SoundEffect.addPanner(
            waveSurfer,
            pannerOption
        ))
        region["effect"] = PannerOption.name
        region["effectOption"] = pannerOption
    }

    playPauseAll() {
        for (let index in this.waveArray) {
            const waveSurfer = this.waveArray[index];
            if (this.isPlayOn) {
                waveSurfer.pause();
            }
            else {
                waveSurfer.play();
            }
        }
        this.isPlayOn = !this.isPlayOn

        let playPauseButtonImage = document.getElementById("playPauseButtonImage")

        if (this.waveArray[0].isPlaying()) {
            playPauseButtonImage.innerHTML = "pause"
        }
        else {
            playPauseButtonImage.innerHTML = "play_arrow"
        }

    }

    destroyAll() {
        for (let index in this.waveArray) {
            const waveSurfer = this.waveArray[index];
            waveSurfer.pause();
            waveSurfer.destroy();
        }
        this.waveArray = {}
    }

    skipTo(sec) {
        for (let index in this.waveArray) {
            const waveSurfer = this.waveArray[index];
            waveSurfer.skip(sec);
        }
    }

    mute(id) {
        this.waveArray[id].toggleMute()
        document.getElementById("muteButton_" + id).className += " activated-button"
        this.checkButtons()
    }

    isolate(id) {
        this.waveArray[id].setMute(false)
        for (let index in this.waveArray) {
            const waveSurfer = this.waveArray[index];

            if (id != index) {
                waveSurfer.setMute(true);
            }
        }
        this.checkButtons()
    }

    changeVolume(id) {
        this.waveArray[id].setVolume(document.getElementById("inputVolume_" + id).value / 100)
    }

    displayEffectPannel(i) {
        let ofg = new OptionFormGenerator("effectForm", "editorActionBar", EFFECTS)
        ofg.buidlFormField()

        let select = document.getElementById("available")
        select.addEventListener("change", () => {
            // TODO : refactor
            switch (select.value) {
                case "filters":
                    ofg = new OptionFormGenerator("effectForm", "editorActionBar", FilterOption.options)
                    ofg.buidlFormField()
                    ofg.addActions({
                        "Apply": {
                            "name": "applyEffectBtn",
                            "action": () => this.applyFilter()
                        },
                        "Back": {
                            "name": "backBtn",
                            "action": () => this.displayEffectPannel()
                        }
                    })
                    break
                case "panner":
                    ofg = new OptionFormGenerator("effectForm", "editorActionBar", PannerOption.options)
                    ofg.buidlFormField()
                    ofg.addActions({
                        "Apply": {
                            "name": "applyEffectBtn",
                            "action": () => this.applyPanner()
                        },
                        "Back": {
                            "name": "backBtn",
                            "action": () => this.displayEffectPannel()
                        }
                    })
                    break
                default:
                    break
            }
        })
        this.selectedTrack = i
    }

    checkButtons() {
        let nonMuted = []

        for (let index in this.waveArray) {
            const waveSurfer = this.waveArray[index];
            let button = document.getElementById("muteButton_" + index)

            if (waveSurfer.isMuted) {
                button.className += " activated-button"
            }
            else {
                button.classList.remove("activated-button")
                nonMuted += index
            }
        }


        for (let i in this.waveArray) {
            document.getElementById("isolateButton_" + i).classList.remove("activated-button")
        }

        if (nonMuted.length == 1) {
            document.getElementById("isolateButton_" + nonMuted[0]).className += " activated-button"
        }
    }

    checkKey(e) {
        e = e || window.event;

        if (e.keyCode == '39') {
            //Right arrow -> 5 secs forward
            this.skipTo(5)
        }
        else if (e.keyCode == '37') {
            //Left arrow -> 5 secs backward
            this.skipTo(-5)
        }
        else if (e.keyCode == '32') {
            //Spacebar -> play/pause
            e.preventDefault()
            this.playPauseAll()
        }
    }

    saveEffect(i) {
        let waveSurfer = this.waveArray[i]
        let songID = waveSurfer.songID

        let trackEffects = []
        for(let regionIdx in waveSurfer.regions.list){
            let region = waveSurfer.regions.list[regionIdx]
            trackEffects.push({
                "start": region.start,
                "end": region.end,
                "effect": region.effect,
                "effectOption": region.effectOption
            })
        }

        let myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded")
        myHeaders.append("X-CSRFToken", Cookies.get("csrftoken"), "") // TODO set CSRF

        let formdata = new FormData();
        formdata.append("file", JSON.stringify(trackEffects))
        formdata.append("audio", songID)

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        }

        fetch("/effect", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log("error", error))
    }

    syncTracks(track) {
        let songID = track["songID"]
        let trackID = track["trackID"]
        let waveSurfer = track["wave"]
        this.waveArray[trackID] = track["wave"]

        let mostAdvancedTrack = sortByValue(this.waveArray, (first, second) => {
            return second[1].getCurrentTime() - first[1].getCurrentTime()
        })[0][1]
        let skipLenght = mostAdvancedTrack.getCurrentTime() - waveSurfer.getCurrentTime()

        if (trackID !== 0) {
            waveSurfer.skip(skipLenght)
            waveSurfer.setMute(true)
            waveSurfer.play()
        }

        waveSurfer["songID"] = songID

        this._bindTrackControl(trackID)
        this._loadEffect(trackID, songID)
    }

    _loadEffect(i, songID) {
        let waveSurfer = this.waveArray[i]

        fetch("/effect/" + songID).then(response => {
            // TODO get regions from response
            regions.forEach(function (region) {
                wavesurfer.addRegion(region)
                // TODO add effect
            });
        }).catch(error => {
            console.log("error", error)
        })
    }

    _bindEvents() {
        document.onkeydown = this.checkKey.bind(this)
    }

    _bindTrackControl(i) {
        let muteBtn = document.getElementById("muteButton_" + i)
        muteBtn.addEventListener("click", () => this.mute(i))

        let isolateBtn = document.getElementById("isolateButton_" + i)
        isolateBtn.addEventListener("click", () => this.isolate(i))

        let volumeBtn = document.getElementById("inputVolume_" + i)
        volumeBtn.addEventListener("input", () => this.changeVolume(i))

        let effectBtn = document.getElementById("effectButton_" + i)
        effectBtn.addEventListener("click", () => this.displayEffectPannel(i))

        let saveBtn = document.getElementById("saveButton_" + i)
        saveBtn.addEventListener("click", () => this.saveEffect(i))
    }
}

