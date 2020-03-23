import { getData } from "/static/js/utils/utils.js"
import { SoundEffect } from "/static/js/sound/effect/effectManager.js"

export class ProjectManager {

    constructor(pubSub) {
        this.pubSub = pubSub
        this.isEditorLocked = false
        this.isSeekLocked = false
        this.waveArray = []
        this.soundEffect = new SoundEffect()
        this._bindEventListener()
    }

    async prepareEditor(isAlreadyLoaded = false, selectLast = false) {
        if (!this.isEditorLocked) {
            this.isEditorLocked = true

            var url = window.location.href;
            var lastPart = url.substr(url.lastIndexOf('/') + 1);
            if (lastPart === "editor") {

                document.getElementById("wave-container").innerHTML = ""

                if (!isAlreadyLoaded) {
                    await this.prepareProjectSelector(selectLast)
                }
                else {
                    this.pubSub.publish("changeProject", null)
                }

                let selectedProject = document.getElementById('projectSelector')

                if (selectedProject.selectedIndex != -1) {
                    let selectedProjectID = selectedProject.options[selectedProject.selectedIndex].value;
                    let songs = await getData('/project/' + selectedProjectID).then(songs => { return songs['audio_files'] })
                    this.pubSub.publish("songsLoaded", songs)

                    for (var i = 0; i < songs.length; i++) {
                        let currentID = songs[i]["id"]
                        let rowElement = document.createElement("div")
                        let colElement = document.createElement("div")
                        let cardPanelElement = document.createElement("div")
                        let controlsElement = document.createElement("div")
                        let infoElement = document.createElement("div")
                        let waveFormElement = document.createElement("div")

                        rowElement.className += "row"
                        rowElement.className += " flex-row"
                        colElement.className += "col"
                        colElement.className += " s8"
                        cardPanelElement.className += "card-panel hoverable"
                        controlsElement.className += "controls col s2"
                        infoElement.className += "controls col s2"
                        waveFormElement.id = "waveForm_" + currentID

                        let preLoader = '<div id="progressDiv' + currentID + '" class="progress progress-waveform"><div class="determinate" id="progress_' + currentID + '" style="width: 30%"></div></div>'

                        controlsElement.innerHTML += '<a id="muteButton_' + i + '" class="btn-floating btn-small waves-effect waves-light deep-orange darken-1"><i class="material-icons">volume_off</i></a>'
                        controlsElement.innerHTML += '<p class="range-field"><input type="range" id="inputVolume_' + i + '" min="0" max="100" value="100"/></p>'
                        controlsElement.innerHTML += '<a id="isolateButton_' + i + '" class="btn-floating btn-small waves-effect waves-light deep-orange darken-1"><i class="material-icons">hearing</i></a>'
                        controlsElement.innerHTML += '<a id="effectButton_' + i + '" class="btn-floating btn-small waves-effect waves-light deep-orange darken-1 modal-trigger" href="#effectModal"><i class="material-icons">blur_on</i></a>'

                        cardPanelElement.appendChild(waveFormElement)
                        cardPanelElement.insertAdjacentHTML('beforeend', preLoader)
                        colElement.appendChild(cardPanelElement)
                        rowElement.appendChild(infoElement)
                        rowElement.appendChild(colElement)
                        rowElement.appendChild(controlsElement)

                        document.getElementById("wave-container").appendChild(rowElement)

                        let wavesurfer = WaveSurfer.create({
                            container: '#waveForm_' + currentID,
                            waveColor: 'violet',
                            progressColor: 'purple',
                            plugins: [
                                WaveSurfer.regions.create({})
                            ]
                        });

                        // IIFE
                        (function (lockedID) {

                            wavesurfer.on('seek', function (progress) {
                                if (!this.isSeekLocked) {
                                    this.changeSeek(progress)
                                }
                            }.bind(this))

                            wavesurfer.on('loading', function (progress) {
                                this.changeProgressPercentage(progress, lockedID)
                            }.bind(this))

                            wavesurfer.on('ready', function () {
                                this.changeProgressPercentage(100, lockedID)
                            }.bind(this))

                            fetch("download/" + lockedID).then(response => {
                                let filename = response.headers.get('content-disposition').split("filename=")[1].replace(/['"]+/g, '')

                                infoElement.innerHTML += '<p>' + filename + '</p>'
                                infoElement.innerHTML += '<a class="btn-floating btn-small waves-effect waves-light red" href="' + "download/" + currentID + '"><i class="material-icons">file_download</i></a>'

                                return response.blob();
                            })
                            .then((blob) => {
                                wavesurfer.loadBlob(blob);
                            })


                        }).bind(this)(currentID);

                        this.waveArray[i] = wavesurfer
                    }

                    this.pubSub.publish('songLoaded', this.waveArray)

                    document.getElementById("playPauseMenu").classList.remove("hide")
                    document.getElementById("aiSplitMenu").classList.remove("hide")

                    if (selectedProject.options.length == 1 && Cookies.get('discoveryTunnel') == '2') {
                        globalEnableDiscoveryTrack = true; // TODO fix
                        startupDiscoveryTunnel();
                    }
                    else {
                        Cookies.set('discoveryTunnel', '7')
                    }


                }
            }
            this.isEditorLocked = false
        }

    }

    changeProject() {
        this.waveArray = []
        this.prepareEditor(true);
        document.getElementById("playPauseButtonImage").innerHTML = "play_arrow"
    }

    async prepareProjectSelector(selectLast = false) {
        let projects = await getData('projects').then(projects => { return projects['users_project'] })
        if (projects.length > 0) {
            let projectSelector = document.getElementById('projectSelector')
            projectSelector.innerHTML = ""

            for (let i = 0; i < projects.length; i++) {
                const element = projects[i];
                let option = document.createElement('option')
                option.appendChild(document.createTextNode(element['name']))
                option.value = element['id']
                projectSelector.appendChild(option)
                if (i == projects.length - 1 && selectLast) { projectSelector.value = option.value }
            }
            M.FormSelect.init(projectSelector, {})
        }
    }

    changeProgressPercentage(progress, id) {
        document.getElementById("progress_" + id).style.width = progress + "%"
    }

    changeSeek(progress) {
        this.isSeekLocked = true
        for (let index = 0; index < this.waveArray.length; index++) {
            let waveSurfer = this.waveArray[index];
            waveSurfer.seekTo(progress)
        }
        this.isSeekLocked = false
    }

    _bindEventListener() {
        let projectSelector = document.getElementById("projectSelector")
        projectSelector.addEventListener("change", () => this.changeProject())
    }
}