// TODO : delete or move in another file after test
window.addEventListener("DOMContentLoaded", () => {
  M.AutoInit();
  prepareEditor();

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

  // stems = 5,4,2
  function splitSound(songId = '1', stems = '2_stems') {
    socket.send(
      JSON.stringify({
        'song_id': songId,
        'stems': stems,
      })
    )
  }
});

let globalSeekLock = false

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
    // Inits Tooltips
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
        enterDelay: 300,
    });

    // Elements with class « file-field »
    $$.fileFields.forEach((item, i) =>
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

async function prepareEditor()
{
  var url = window.location.href;
  var lastPart = url.substr(url.lastIndexOf('/') + 1);
  if (lastPart === "editor") {

    let songs = await getSongList().then(songs => {return songs})

    songs = songs['audio_files']

    waveArray = []

    for (var i = 0; i < songs.length; i++) {
      currentID = songs[i][1]
      let rowElement = document.createElement("div")
      let colElement = document.createElement("div")
      let cardPanelElement = document.createElement("div")
      let waveFormElement = document.createElement("div")

      rowElement.className += "row"
      colElement.className += "col"
      colElement.className += "s12"
      cardPanelElement.className += "card-panel hoverable"
      waveFormElement.id = "waveForm_" + currentID

      let preLoader =  '<div id="progressDiv'+ currentID +'" class="progress progress-waveform"><div class="determinate" id="progress_'+ currentID +'" style="width: 30%"></div></div>'

      cardPanelElement.appendChild(waveFormElement)
      cardPanelElement.insertAdjacentHTML('beforeend', preLoader)
      colElement.appendChild(cardPanelElement)
      rowElement.appendChild(colElement)

      document.getElementById("wave-container").appendChild(rowElement)


      let wavesurfer = WaveSurfer.create({
        container: '#waveForm_' + currentID,
        waveColor: 'violet',
        progressColor: 'purple'
      });

      // IIFE
      (function(lockedID){
        wavesurfer.load("download/" + currentID)

        wavesurfer.on('seek', function(progress) {
          if(!globalSeekLock){
            changeSeek(progress)
          }
        })

        wavesurfer.on('loading', function(progress){
          changeProgressPercentage(progress, lockedID)
        })
      })(currentID);

      waveArray[i] = wavesurfer
    }

    console.log("Editor loaded")
  }
}

function changeProgressPercentage(progress, id)
{
  document.getElementById("progress_" + id).style.width = progress + "%"
}

function changeSeek(progress)
{
  globalSeekLock = true
  for (let index = 0; index < waveArray.length; index++) {
    let waveSurfer = waveArray[index];
    waveSurfer.seekTo(progress)
  }
  globalSeekLock = false
}

//
// Uploads a sound file to the server in order to split it
function uploadSongs()
{
  enableUploadButton(false)
  fileInput = document.getElementById('sound-file-input')

  let file = fileInput.files[0]
  let formData = new FormData();
  formData.append('file', file);

  let options = {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: formData,
    credentials: 'same-origin'
  }

  fetch('upload', options).then(
    response => {
      if(response.ok){
        M.toast({html: "Successfully uploaded song"})
        enableUploadButton(true)
        closeModal("uploadFileDialog")
        document.getElementById('uploadSongClose').click()
      }
      else{
        M.toast({html: "An error occured while uploading your song"})
        enableUploadButton(true)
      }
    }
  ).catch(
    error => M.toast({html: error.message})
  )
}


function enableUploadButton(enable)
{
  let button = document.getElementById('uploadSongButton')
  let preLoader = document.getElementById('uploadSongPreloader')

  if(enable){
    button.disabled = false;
    preLoader.style.display = "none"
  }
  else{
    button.disabled = true;
    preLoader.style.display = "block"
  }
}

function closeModal(id)
{
  let modal = document.getElementById(id)
  let instance = M.Modal.getInstance(modal)
  instance.close();
}

async function getSongList()
{
  let options = {
    method: 'GET',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    },
    credentials: 'same-origin'
  }

  let songs = await fetch('audio', options)
  .then(response=>response.json())
  .then(
    data => {
        return data
    }
  ).catch(
    error => M.toast({html: error.message})
  )
  return songs
}

function downloadSong()
{
  //URL download/SONGID
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

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
