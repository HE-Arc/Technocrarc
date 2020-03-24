import { FilterOption } from "/static/js/sound/effect/effects.js"

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

    static removeFilter(wavesurfer) {
        wavesurfer.backend.disconnectFilters()
    }

}