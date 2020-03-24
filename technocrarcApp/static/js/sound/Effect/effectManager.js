import { FilterOption } from "/static/js/sound/effect/filters.js"
import { PannerOption } from "/static/js/sound/effect/panners.js"

export class SoundEffect {

    static addFilter(wavesurfer, options) {
        if (!options instanceof FilterOption)
            throw "Invalid option for filter"

        let filter = wavesurfer.backend.ac.createBiquadFilter()
        filter.type = options.type
        filter.Q.value = options.Q
        filter.frequency.value = options.frequency
        filter.gain.value = options.gain

        wavesurfer.backend.setFilter(filter);
    }

    static addPanner(wavesurfer, options) {
        if (!options instanceof PannerOption)
            throw "Invalid option for panner"

        let panner = wavesurfer.backend.ac.createPanner()
        panner.coneOuterGain = options.coneOuterGain
        panner.coneOuterAngle = options.coneOuterAngle
        panner.coneInnerAngle = options.coneInnerAngle
        panner.setPosition(options.position.x, options.position.y, options.position.z)
        panner.setPosition(options.orientation.x, options.orientation.y, options.orientation.z)

        wavesurfer.backend.setFilter(panner)
    }

    static removeFilter(wavesurfer) {
        wavesurfer.backend.disconnectFilters()
    }

}