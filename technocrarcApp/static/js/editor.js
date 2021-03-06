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
    pubSub.subscribe("changeProject", () => projectController.destroyAll())
    pubSub.subscribe("trackLoaded", (track) => projectController.syncTracks(track))
    pubSub.subscribe("playAllFinish", () => projectController.playAllFinish())

    let songUploader = new SongUploader(pubSub)
    pubSub.subscribe("prepareEditor", () => {
        projectManager.prepareEditor(false, true)
    })

    let aiSpleeter = new AISpleeter(pubSub)
    pubSub.subscribe("projectLoaded", (songs) => aiSpleeter.updateSongs(songs))
    pubSub.subscribe("songSplitted", () => projectManager.prepareEditor(true))
})()
