export default function applyFilter() {
    let freq = document.getElementById('frequency').value
    let gain = document.getElementById('gain').value
    let Q = document.getElementById('Q').value
    let type = document.getElementById('type').value

    filterOption.frequency = parseInt(freq)
    filterOption.gain = parseInt(gain)
    filterOption.Q = parseInt(Q)
    filterOption.type = type

    soundEffect.addFilter(selectedTrack, filterOption)
}

export default function removeEffect() {
    soundEffect.removeFilter(selectedTrack)
}

export default function selectTrack(i) {
    selectedTrack = i
}

/*
let selectedTrack = 0

let filterOption = new FilterOption("lowpass", 240, 20, 50)
let ofg = new OptionFormGenerator("effectForm", filterOption.getAvailableOptions())
ofg.buidlFormField()
*/