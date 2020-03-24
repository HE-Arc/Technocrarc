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

    applyFilter() {
        let freq = document.getElementById("frequency").value
        let gain = document.getElementById("gain").value
        let Q = document.getElementById("Q").value
        let type = document.getElementById("type").value

        let filterOption = new FilterOption(parseInt(freq), parseInt(gain), parseInt(Q), type)

        let waveSurfer = this.waveArray[this.selectedTrack]
        SoundEffect.addFilter(waveSurfer, filterOption)
    }

    applyPanner() {
        let waveSurfer = this.waveArray[this.selectedTrack]

        let coneOuterGain = document.getElementById("coneOuterGain").value
        let coneOuterAngle = document.getElementById("coneOuterAngle").value
        let coneInnerAngle = document.getElementById("coneInnerAngle").value

        SoundEffect.addPanner(
            waveSurfer,
            new PannerOption(coneOuterGain, coneOuterAngle, coneInnerAngle,
                new Position(5, 0, 0),
                new Orientation(90, 90, 0)
            )
        )
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
                        "Remove": {
                            "name": "removeEffectBtn",
                            "action": () => this.removeEffect()
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
                        "Remove": {
                            "name": "removeEffectBtn",
                            "action": () => this.removeEffect()
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

    removeEffect() {
        let waveSurfer = this.waveArray[this.selectedTrack]
        SoundEffect.removeFilter(waveSurfer)
    }

    syncTracks(track) {
        // {"trackID": trackID, "wave": wavesurfer}
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

        this._bindTrackControl(trackID)
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
    }
}

