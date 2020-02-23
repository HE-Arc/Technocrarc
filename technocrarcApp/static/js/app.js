
var socket = new WebSocket('ws://' + window.location.host + '/ws/background-tasks/')

socket.onopen = function open(e) {
    console.log('WebSockets connection created.')
    socket.send(JSON.stringify({'message': 'message'}))
}

socket.onmessage = function onMessage(e) {
    console.log(e)
}

socket.onclose = function onClose(e) {
    console.log(e)
}

if (socket.readyState == WebSocket.OPEN) {
    socket.onopen()
}

// DOM
const $$ = {
    soundFileInput: document.querySelector('#sound-file-input'),
};

// Drag & Drop
// Drag enter -> can modify style in order
document.querySelector('.input-file-dragdrop').addEventListener('dragenter', evt =>
{
    evt.preventDefault();
});

// Drop on file input
document.querySelector('.input-file-dragdrop').addEventListener('drop', evt =>
{
    evt.preventDefault();
    let files = evt.dataTransfer.files;

    parseAudioFiles(files);
});

function parseAudioFiles(files)
{
    if (files.length > 1)
    {
        alert('You can only upload one audio file at a time.');
    }
    else
    {
        let file = files[0];
        let fileName = file.name;
        let fileType = file.type;
        let fileSize = file.size;

        if (! fileType.includes('audio'))
        {
            alert('The file format must be audio.');
        }
        // TODO: Can limit size here
        else
        {
            $$.soundFileInput.files = files;
            console.log('It worked !');
        }
    }
}
