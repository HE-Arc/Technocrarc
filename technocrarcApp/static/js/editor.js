import { ProjectManager } from "/static/js/project/project.js"
import { ProjectController } from "/static/js/project/projectControl.js"
import { DiscoveryTunnel } from "/static/js/discovery/tunnel.js"
import { PubSub } from "/static/js/utils/pubsub.js"
import { SongUploader } from "/static/js/sound/musicUpload.js"
import { AISpleeter } from "/static/js/sound/splitter.js"

(function () {
    M.AutoInit()

    let pubSub = new PubSub()

    let discoveryTunnel = new DiscoveryTunnel()
    discoveryTunnel.startupDiscoveryTunnel()

    let projectManager = new ProjectManager(pubSub)
    projectManager.prepareEditor()
    pubSub.subscribe("upDiscoveryTunnel", () => {
        discoveryTunnel.globalEnableDiscoveryTrack = true
        discoveryTunnel.startupDiscoveryTunnel();
    })

    let projectController = new ProjectController()
    pubSub.subscribe("songLoaded", (waveArray) => projectController.loadSong(waveArray))
    pubSub.subscribe("changeProject", () => projectController.destroyAll())


    let songUploader = new SongUploader()

    let aiSpleeter = new AISpleeter(pubSub)
    pubSub.subscribe("songsLoaded", (songs) => aiSpleeter.updateSongs(songs))
    pubSub.subscribe("songSplitted", () => projectManager.prepareEditor(true))
})()

