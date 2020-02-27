// TODO : delete or move in another file after test
window.addEventListener("DOMContentLoaded", () => {
    var socket = new WebSocket('ws://' + window.location.host + '/ws/background-tasks/')

    socket.onopen = function open(e) {
        console.log('WebSockets connection created.')
        splitSound()
    }

    socket.onmessage = function onMessage(e) {
        console.log(e)
        let json_data = JSON.parse(e.data)
        console.log(json_data)
    }

    socket.onclose = function onClose(e) {
        console.log(e)
    }

    if (socket.readyState == WebSocket.OPEN) {
        socket.onopen()
    }

    function splitSound(songId = '16', stems = '10_stems') {
        socket.send(
            JSON.stringify({
                'song_id': '16',
                'stems': stems,
            })
        )
    }
});



// DOM
const $$ = {
    soundUploadForm: document.querySelector('#form-upload-sound'),
    soundFileInput: document.querySelector('#sound-file-input'),
    fileField: document.querySelector('.file-field'),
    dragDropFigure: document.querySelector('.dragdrop-figure'),
    dragDropUploaded: document.querySelector('.dragdrop-uploaded'),
    dragDropClose: document.querySelector('.dragdrop-uploaded .close'),
};

/**
 * Audio file upload
 */

// Drag enter -> modify style
$$.fileField.addEventListener('dragenter', evt =>
{
    evt.preventDefault();
    $$.fileField.classList.add('dragenter');
});

// Drag leave -> modify style
$$.fileField.addEventListener('dragleave', evt =>
{
    evt.preventDefault();
    $$.fileField.classList.remove('dragenter');
});

// Drop on « file input »
$$.fileField.addEventListener('drop', evt =>
{
    evt.preventDefault();

    let files = evt.dataTransfer.files;
    parseAudioFiles(files);
});

// File uploaded by file dialog
$$.soundFileInput.addEventListener('change', (evt) =>
{
    evt.preventDefault();

    let files = evt.target.files;
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
            showUploadedFile();
        }
    }
}

// Displays the uploaded sound file information
function showUploadedFile()
{
    let file = $$.soundFileInput.files[0];
    $$.dragDropUploaded.querySelector('.uploaded-file-name').innerHTML = file.name;
    $$.dragDropUploaded.querySelector('.uploaded-file-size').innerHTML = file.size;

    $$.dragDropFigure.setAttribute('hidden', true);
    $$.dragDropUploaded.removeAttribute('hidden');
}

// Displays the Drag & Drop information
function showDragDropFigure()
{
    $$.soundFileInput.value = '';

    $$.dragDropUploaded.setAttribute('hidden', true);
    $$.dragDropFigure.removeAttribute('hidden');
}

// Drag & Drop « close » icon
$$.dragDropClose.addEventListener('click', evt =>
{
    showDragDropFigure();
});

// Upload sound file form on submit
$$.soundUploadForm.addEventListener('submit', evt =>
{
    evt.preventDefault();

    //TODO
});

// Uploads a sound file to the server in order to split it
function uploadSound()
{
    //TODO
}

// Displays the preloader(s)
function activatePreloader()
{
    document.querySelector('.preloader-container').style.display = 'block';
}

// Hides the preloader(s)
function deactivatePreloader()
{
    document.querySelector('.preloader-container').style.display = 'none';
}
