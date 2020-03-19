// TODO : delete or move in another file after test
document.onkeydown = checkKey
window.addEventListener("DOMContentLoaded", () => {
  M.AutoInit();
  prepareEditor();

  var socket = new WebSocket('ws://' + window.location.host + '/ws/background-tasks/')
  socket.onopen = function open(e) {
    console.log('WebSockets connection created.')
    splitSound()
  }

  socket.onmessage = function onMessage(e) {
    let json_data = JSON.parse(e.data)
  }

  socket.onclose = function onClose(e) {
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

async function prepareEditor(isAlreadyLoaded = false)
{
  var url = window.location.href;
  var lastPart = url.substr(url.lastIndexOf('/') + 1);
  if (lastPart === "editor") {

    document.getElementById("wave-container").innerHTML = ""

    if(!isAlreadyLoaded)
    { 
      await prepareProjectSelector() 
    }
    else{
      destroyAll()
    }

     let selectedProject = document.getElementById('projectSelector')
  
    if(selectedProject.selectedIndex != -1)
    {
      let selectedProjectID = selectedProject.options[selectedProject.selectedIndex].value;
      let songs = await getData('/project/'+selectedProjectID).then(songs => {return songs['audio_files']})

      waveArray = []

      for (var i = 0; i < songs.length; i++) {
        currentID = songs[i]["id"]
        let rowElement = document.createElement("div")
        let colElement = document.createElement("div")
        let cardPanelElement = document.createElement("div")
        let controlsElement = document.createElement("div")
        let waveFormElement = document.createElement("div")

        rowElement.className += "row"
        rowElement.className += " flex-row"
        colElement.className += "col"
        colElement.className += " s10"
        cardPanelElement.className += "card-panel hoverable"
        controlsElement.className += "controls col s2"
        waveFormElement.id = "waveForm_" + currentID

        let preLoader =  '<div id="progressDiv'+ currentID +'" class="progress progress-waveform"><div class="determinate" id="progress_'+ currentID +'" style="width: 30%"></div></div>'

        controlsElement.innerHTML = '<a onclick="mute('+ i +')" id=muteButton_'+ i +' class="btn-floating btn-small waves-effect waves-light deep-orange darken-1"><i class="material-icons">volume_off</i></a>'
        controlsElement.innerHTML += '<p class="range-field"><input oninput="changeVolume('+ i +')" type="range" id="inputVolume_'+ i +'" min="0" max="100" value="100"/></p>'
        controlsElement.innerHTML += '<a onclick="isolate('+ i +')" id=isolateButton_'+ i +' class="btn-floating btn-small waves-effect waves-light deep-orange darken-1"><i class="material-icons">hearing</i></a>'

        cardPanelElement.appendChild(waveFormElement)
        cardPanelElement.insertAdjacentHTML('beforeend', preLoader)
        colElement.appendChild(cardPanelElement)
        rowElement.appendChild(colElement)
        rowElement.appendChild(controlsElement)

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
    }
    console.log("EDITOR LOADED")
  }
}

function changeProject()
{
  prepareEditor(true);
  document.getElementById("playPauseButtonImage").innerHTML = "play_arrow"
}

async function prepareProjectSelector()
{
  let projects = await getData('projects').then(projects => {return projects['users_project']})
  if(projects.length > 0)
  {
    let projectSelector = document.getElementById('projectSelector')
    projectSelector.innerHTML = ""

    for (let i = 0; i < projects.length; i++) {
      const element = projects[i];
      let option = document.createElement('option')
      option.appendChild(document.createTextNode(element['name']))
      option.value = element['id']
      projectSelector.appendChild(option)
    }
    M.FormSelect.init(projectSelector, {})
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

function playPauseAll()
{
  for (let index = 0; index < waveArray.length; index++) {
    const waveSurfer = waveArray[index];
    waveSurfer.playPause();
  }
  
  playPauseButtonImage = document.getElementById("playPauseButtonImage")
  if (waveArray[0].isPlaying())
  {
    playPauseButtonImage.innerHTML = "pause"
  }
  else{
    playPauseButtonImage.innerHTML = "play_arrow"
  }
}

function destroyAll()
{
  for (let index = 0; index < waveArray.length; index++) {
    const waveSurfer = waveArray[index];
    waveSurfer.pause();
    waveSurfer.destroy();
  }
}

function skipTo(sec)
{
  for (let index = 0; index < waveArray.length; index++) {
    const waveSurfer = waveArray[index];
    waveSurfer.skip(sec);
  }
}

function mute(id)
{
  waveArray[id].toggleMute()
  document.getElementById("muteButton_"+id).className += " activated-button"
  checkButton(id, "muteButton")
}

function isolate(id)
{
  for (let index = 0; index < waveArray.length; index++) {
    const waveSurfer = waveArray[index];
    if(id != index)
    {
      waveSurfer.toggleMute();
      checkButton(index, "muteButton")
    }
  }
  checkButton(id, "isolateButton")
}


function changeVolume(id)
{
  waveArray[id].setVolume(document.getElementById("inputVolume_"+id).value/100)
  
}

function checkButton(id, buttonName)
{
  let button = document.getElementById(buttonName+"_"+id)
  if(waveArray[id].isMuted){
    button.className += " activated-button"
  }
  else{
    button.classList.remove("activated-button")
  }
}

function checkKey(e)
{
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
      playPauseAll()
  }
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
        prepareProjectSelector();
      }
      else{
        M.toast({html: "An error occured while uploading your song"})
        enableUploadButton(true)
        console.log(response)
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


async function getData(route)
{
  let options = {
    method: 'GET',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    },
    credentials: 'same-origin'
  }

  let data = await fetch(route, options)
  .then(response=>response.json())
  .then(
    data => {
        return data
    }
  ).catch(
    error => M.toast({html: error.message})
  )
  return data
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
