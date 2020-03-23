import betweenClosed from "utils/utils.js"

export default class FilterOption {

    _OPTIONS = {
        frequency: {
            type: 'number',
            range: [235, 20000]
        },
        gain: {
            type: 'number',
            range: [-50, 50]
        },
        Q: {
            type: 'number',
            range: [0, 100]
        },
        type: {
            type: 'string',
            range: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"]
        }
    }

    constructor(type, frequency, q, gain) {
        this.frequency = frequency
        this.gain = gain
        this.Q = q
        this.type = type
    }

    getAvailableOptions() {
        return this._OPTIONS
    }

    get frequency() {
        return this._frequency
    }

    get gain() {
        return this._gain
    }

    get Q() {
        return this._Q
    }

    get type() {
        return this._type
    }

    set frequency(value) {
        if (typeof value !== this._OPTIONS.frequency.type || !betweenClosed(value, this._OPTIONS.frequency.range[0], this._OPTIONS.frequency.range[1]))
            throw "Frequency is not a number in valid range"
        this._frequency = value
    }

    set gain(value) {
        if (typeof value !== this._OPTIONS.gain.type || !betweenClosed(value, this._OPTIONS.gain.range[0], this._OPTIONS.gain.range[1]))
            throw "Q is not a number in valid range"
        this._gain = value
    }

    set Q(value) {
        if (typeof value !== this._OPTIONS.Q.type || !betweenClosed(value, this._OPTIONS.Q.range[0], this._OPTIONS.Q.range[1]))
            throw "Q is not a number in valid range"
        this._Q = value
    }

    set type(value) {
        if (typeof value !== this._OPTIONS.type.type || this._OPTIONS.type.range.indexOf(value) <= -1)
            throw "Type is not a valid type"
        this._type = value;
    }

}