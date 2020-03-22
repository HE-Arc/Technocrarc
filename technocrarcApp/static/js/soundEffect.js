class SoundEffect {

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

class FilterOption {

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

class OptionFormGenerator {

    constructor(formId, options) {
        this.form = document.getElementById(formId)
        this.options = options
    }

    buidlFormField() {
        this._clearForm()

        this._parseOptions()

        //let i = this._makeSubmit()
        //this.form.appendChild(i)
    }

    _parseOptions() {
        for (var prop in this.options) {
            if (Object.prototype.hasOwnProperty.call(this.options, prop)) {
                let field = this.options[prop]
                let elem;

                switch (field.type) {
                    case "number":
                        elem = this._makeSlider(prop, prop, field.range[0], field.range[1])
                        break
                    case "string":
                        elem = this._makeSelect(prop, prop, field.range)
                        break
                    default:
                        break
                }

                this.form.appendChild(elem)
            }
        }
    }

    _clearForm() {
        while (this.form.firstChild) {
            this.form.removeChild(this.form.lastChild);
        }
    }

    _makeSelect(id, fieldName, range) {
        let d = document.createElement("div")
        d.classList.add(...["input-field", "col", "s12"])

        let s = document.createElement("select")
        s.setAttribute("id", id)

        for (let opt of range) {
            let o = document.createElement("option")
            o.setAttribute("value", opt)
            o.innerHTML = opt
            s.appendChild(o)
        }

        let l = document.createElement("label")
        l.innerHTML = fieldName

        d.appendChild(s)
        d.appendChild(l)

        return d
    }

    _makeSlider(id, fieldName, min, max) {
        let p = document.createElement("p")
        p.classList.add("range-field")

        let i = document.createElement("input")
        i.setAttribute("type", "range")
        i.setAttribute("id", id)
        i.setAttribute("min", min)
        i.setAttribute("max", max)

        let l = document.createElement("label")
        l.innerHTML = fieldName

        p.appendChild(l)
        p.appendChild(i)

        return p
    }

    _makeSubmit() {
        let i = document.createElement("input")
        i.setAttribute("type", "submit")
        i.setAttribute("value", "Apply")

        return i
    }
}

function applyEffect() {
    let freq = document.getElementById('frequency').value
    let gain = document.getElementById('gain').value
    let Q = document.getElementById('Q').value
    let type = document.getElementById('type').value

    filterOption.frequency = parseInt(freq)
    filterOption.gain = parseInt(gain)
    filterOption.Q = parseInt(Q)
    filterOption.type = type
    console.log(selectedTrack)
    soundEffect.addFilter(selectedTrack, filterOption)
}

function removeEffect() {
    soundEffect.removeFilter(selectedTrack)
}

function selectTrack(i) {
    selectedTrack = i
}

let selectedTrack = 0

let betweenClosed = (x, min, max) => x >= min && x <= max

let filterOption = new FilterOption("lowpass", 240, 20, 50)
let ofg = new OptionFormGenerator("effectForm", filterOption.getAvailableOptions())
ofg.buidlFormField()


