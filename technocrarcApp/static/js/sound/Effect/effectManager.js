export default class SoundEffect {

    constructor() {
        this._waves = {}
    }

    addWave(idx, wave) {
        if (!this._isValidIdx(idx))
            this._waves[idx] = wave
    }

    addFilter(idx, options) {
        if (!this._isValidIdx(idx))
            throw "Invalid index"

        if (!options instanceof FilterOption)
            throw "Invalid option for filter"

        let wavesurfer = this._waves[idx]
        let filter = wavesurfer.backend.ac.createBiquadFilter()
        filter.type = options.type
        filter.Q.value = options.Q
        filter.frequency.value = options.frequency
        filter.gain.value = options.gain

        wavesurfer.backend.setFilter(filter);
    }

    removeFilter(idx) {
        let wavesurfer = this._waves[idx]
        wavesurfer.backend.disconnectFilters()
    }

    _isValidIdx(idx) {
        return idx in this._waves
    }

}