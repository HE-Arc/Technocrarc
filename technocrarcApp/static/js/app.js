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
    soundUploadForms: document.querySelectorAll('.form-upload-sound'),
    soundFileInputs: document.querySelectorAll('.sound-file-input'),
    fileFields: document.querySelectorAll('.file-field'),
    dragDropFigure: document.querySelector('.dragdrop-figure'),
    dragDropUploaded: document.querySelector('.dragdrop-uploaded'),
    dragDropCloses: document.querySelectorAll('.dragdrop-uploaded .close'),
};

document.addEventListener('DOMContentLoaded', (evt) =>
{
    // Elements with class « file-field »
    $$.fileFields.forEach((item, i) =>
    {
        // Drag enter -> modify style
        item.addEventListener('dragenter', evt =>
        {
            evt.preventDefault();
            item.classList.add('dragenter');
        });

        // Drag leave -> modify style
        item.addEventListener('dragleave', evt =>
        {
            evt.preventDefault();
            item.classList.remove('dragenter');
        });

        // Drop on « file input »
        item.addEventListener('drop', evt =>
        {
            evt.preventDefault();

            let input = item.querySelector('.sound-file-input');
            let files = evt.dataTransfer.files;
            parseAudioFiles(input, files);
        });
    });

    // Elements with class « sound-file-input »
    $$.soundFileInputs.forEach((item, i) =>
    {
        // File uploaded by file dialog
        item.addEventListener('change', (evt) =>
        {
            evt.preventDefault();

            let files = evt.target.files;
            parseAudioFiles(item, files);
        });
    });

    // Elements with class « close »
    $$.dragDropCloses.forEach((item, i) =>
    {
        let input = item.parentElement.parentElement.parentElement.querySelector('.sound-file-input');

        // Drag & Drop « close » icon
        item.addEventListener('click', evt =>
        {
            showDragDropFigure(input);
        });
    });

    // Elements with class « form-upload-sound »
    $$.soundUploadForms.forEach((item, i) =>
    {
        // Upload sound file form on submit
        item.addEventListener('submit', evt =>
        {
            evt.preventDefault();

            //TODO
        });
    });
});

function parseAudioFiles(input, files)
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
            input.files = files;
            showUploadedFile(input);
        }
    }
}

// Displays the uploaded sound file information
function showUploadedFile(input)
{
    let file = input.files[0];
    $$.dragDropUploaded.querySelector('.uploaded-file-name').innerHTML = file.name;
    $$.dragDropUploaded.querySelector('.uploaded-file-size').innerHTML = file.size;

    $$.dragDropFigure.setAttribute('hidden', true);
    $$.dragDropUploaded.removeAttribute('hidden');
}

// Displays the Drag & Drop information
function showDragDropFigure(input)
{
    input.value = '';

    $$.dragDropUploaded.setAttribute('hidden', true);
    $$.dragDropFigure.removeAttribute('hidden');
}

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
