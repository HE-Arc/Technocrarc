import {sleep} from "/static/js/utils/utils.js"

export class DiscoveryTunnel {

    constructor() {
        this.globalEnableDiscoveryTrack = true
    }

    startupDiscoveryTunnel() {)
        let currentStep = Cookies.get('discoveryTunnel')

        if (currentStep == undefined) { currentStep = '0' }

        sleep(1000).then(() => {
            switch (currentStep) {
                case '0':
                    this._getTapDiscovery('mainEditorMenuDiscovery').open();
                    Cookies.set('discoveryTunnel', '1')
                    break;
                case '1':
                    M.FloatingActionButton.getInstance(document.getElementById("FABMenu")).open()
                    sleep(500).then(() => {
                        this._getTapDiscovery('createProjectDiscovery').open()
                        Cookies.set('discoveryTunnel', '2')
                    })

                    break;
                case '2':
                    if (this.globalEnableDiscoveryTrack) {
                        this._getTapDiscovery('muteDiscovery').open();
                        Cookies.set('discoveryTunnel', '3')
                    }
                    break;
                case '3':
                    if (this.globalEnableDiscoveryTrack) {
                        this._getTapDiscovery('volumeDiscovery').open()
                        Cookies.set('discoveryTunnel', '4')
                    }
                    break;
                case '4':
                    if (this.globalEnableDiscoveryTrack) {
                        this._getTapDiscovery('isolateDiscovery').open()
                        Cookies.set('discoveryTunnel', '5')
                    }
                    break;
                case '5':
                    if (this.globalEnableDiscoveryTrack) {
                        M.FloatingActionButton.getInstance(document.getElementById("FABMenu")).open()
                        sleep(500).then(() => {
                            this._getTapDiscovery('AISplitDiscovery').open()
                            Cookies.set('discoveryTunnel', '6')
                        })
                    }
                    break;
                case '6':
                    if (this.globalEnableDiscoveryTrack) {
                        this._getTapDiscovery('trackDiscovery').open()
                        Cookies.set('discoveryTunnel', '7')
                    }
                default:
                    break;
            }
        })
    }

    _getTapDiscovery(name) {
        let elem = document.getElementById(name)
        elem.className += " tap-target"
        elem.classList.remove("hide")

        let options = {
            onClose: () => this.closeDiscovery(name)
        }

        let discovery = M.TapTarget.init(elem, options)
        return discovery
    }

    closeDiscovery(name) {
        sleep(500).then(() => {
            let elem = document.getElementById(name)
            let discovery = M.TapTarget.getInstance(elem).destroy()

            document.querySelectorAll('.tap-target-wrapper').forEach(function (a) {
                a.remove()
            })

            this.startupDiscoveryTunnel()
        })
    }

}

