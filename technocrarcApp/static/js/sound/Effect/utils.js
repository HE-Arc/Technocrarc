export function applyFilter() {
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

export function removeEffect() {
    soundEffect.removeFilter(selectedTrack)
}

export function selectTrack(i) {
    selectedTrack = i
}