import { betweenClosed } from "/static/js/utils/utils.js"

export class FilterOption {

    constructor(frequency, gain, q, type) {
        this.frequency = frequency
        this.gain = gain
        this.Q = q
        this.type = type
    }

    static get options() {
        return {
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
        if (typeof value !== FilterOption.options.frequency.type ||
            !betweenClosed(value, FilterOption.options.frequency.range[0], FilterOption.options.frequency.range[1]))
            throw "Frequency is not a number in valid range"
        this._frequency = value
    }

    set gain(value) {
        if (typeof value !== FilterOption.options.gain.type ||
            !betweenClosed(value, FilterOption.options.gain.range[0], FilterOption.options.gain.range[1]))
            throw "Q is not a number in valid range"
        this._gain = value
    }

    set Q(value) {
        if (typeof value !== FilterOption.options.Q.type ||
            !betweenClosed(value, FilterOption.options.Q.range[0], FilterOption.options.Q.range[1]))
            throw "Q is not a number in valid range"
        this._Q = value
    }

    set type(value) {
        if (typeof value !== FilterOption.options.type.type ||
            FilterOption.options.type.range.indexOf(value) <= -1)
            throw "Type is not a valid type"
        this._type = value;
    }

}