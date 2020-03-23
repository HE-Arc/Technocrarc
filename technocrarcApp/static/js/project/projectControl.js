function playPauseAll() {
    for (let index = 0; index < waveArray.length; index++) {
        const waveSurfer = waveArray[index];
        if (globalPlay) {
            waveSurfer.pause();
        }
        else {
            waveSurfer.play();
        }
    }
    globalPlay = !globalPlay

    playPauseButtonImage = document.getElementById("playPauseButtonImage")
    if (waveArray[0].isPlaying()) {
        playPauseButtonImage.innerHTML = "pause"
    }
    else {
        playPauseButtonImage.innerHTML = "play_arrow"
    }

}

function destroyAll() {
    for (let index = 0; index < waveArray.length; index++) {
        const waveSurfer = waveArray[index];
        waveSurfer.pause();
        waveSurfer.destroy();
    }
}

function skipTo(sec) {
    for (let index = 0; index < waveArray.length; index++) {
        const waveSurfer = waveArray[index];
        waveSurfer.skip(sec);
    }
}

function mute(id) {
    waveArray[id].toggleMute()
    document.getElementById("muteButton_" + id).className += " activated-button"
    checkButtons()
}

function isolate(id) {
    waveArray[id].setMute(false)
    for (let index = 0; index < waveArray.length; index++) {
        const waveSurfer = waveArray[index];
        if (id != index) {
            waveSurfer.setMute(true);
        }
    }
    checkButtons()
}

function changeVolume(id) {
    waveArray[id].setVolume(document.getElementById("inputVolume_" + id).value / 100)

}

function checkButtons() {
    let nonMuted = []

    for (let index = 0; index < waveArray.length; index++) {
        const waveSurfer = waveArray[index];
        let button = document.getElementById("muteButton_" + index)

        if (waveSurfer.isMuted) {
            button.className += " activated-button"
        }
        else {
            button.classList.remove("activated-button")
            nonMuted += index
        }
    }


    for (let i = 0; i < waveArray.length; i++) {
        document.getElementById("isolateButton_" + i).classList.remove("activated-button")
    }

    if (nonMuted.length == 1) {
        document.getElementById("isolateButton_" + nonMuted[0]).className += " activated-button"
    }
}

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '39') {
        //Right arrow -> 5 secs forward
        skipTo(5)
    }
    else if (e.keyCode == '37') {
        //Left arrow -> 5 secs backward
        skipTo(-5)
    }
    else if (e.keyCode == '32') {
        //Spacebar -> play/pause
        e.preventDefault()
        playPauseAll()
    }
}