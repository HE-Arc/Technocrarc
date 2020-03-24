import { OptionFormGenerator } from "/static/js/sound/effect/form/formGeneration.js"
import { FilterOption } from "/static/js/sound/effect/effects.js"
import { SoundEffect } from "/static/js/sound/effect/effectManager.js"
import { sortByValue } from "/static/js/utils/utils.js"

export class ProjectController {

    constructor() {
        this.waveArray = {}
        this.isPlayOn = false
        this.selectedTrack = 0
        this._bindEvents()
    }

    applyEffect() {
        let freq = document.getElementById('frequency').value
        let gain = document.getElementById('gain').value
        let Q = document.getElementById('Q').value
        let type = document.getElementById('type').value

        let filterOption = new FilterOption(parseInt(freq), parseInt(gain), parseInt(Q), type)

        let waveSurfer = this.waveArray[this.selectedTrack]
        SoundEffect.addFilter(waveSurfer, filterOption)
    }

    playPauseAll() {
        for(let index in this.waveArray) {
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
        for(let index in this.waveArray) {
            const waveSurfer = this.waveArray[index];
            waveSurfer.pause();
            waveSurfer.destroy();
        }
        this.waveArray = {}
    }

    skipTo(sec) {
        for(let index in this.waveArray) {
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
        for(let index in this.waveArray) {
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
        let ofg = new OptionFormGenerator("effectForm", FilterOption.options)
        ofg.buidlFormField()
        this.selectedTrack = i
    }

    checkButtons() {
        let nonMuted = []

        for(let index in this.waveArray) {
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


        for(let i in this.waveArray) {
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

        let applyEffectBtn = document.getElementById("applyEffectBtn")
        applyEffectBtn.addEventListener("click", () => this.applyEffect())

        let removeEffectBtn = document.getElementById("removeEffectBtn")
        removeEffectBtn.addEventListener("click", () => this.removeEffect())
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

