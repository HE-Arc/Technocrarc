// TODO : delete or move in another file after test
document.onkeydown = checkKey
window.addEventListener("DOMContentLoaded", () => {
  M.AutoInit();
  prepareEditor();
  startupDiscoveryTunnel();
});

let globalSeekLock = false
let globalEditorLock = false
let globalPlay = false
let waveArray = []
let soundEffect = new SoundEffect()
let globalSplitCounter = 0
let globalEnableDiscoveryTrack = false

// DOM
const $$ = {
  soundUploadForms: document.querySelectorAll('.form-upload-sound'),
  soundFileInputs: document.querySelectorAll('.sound-file-input'),
  fileFields: document.querySelectorAll('.file-field'),
  dragDropFigure: document.querySelector('.dragdrop-figure'),
  dragDropUploaded: document.querySelector('.dragdrop-uploaded'),
  dragDropCloses: document.querySelectorAll('.dragdrop-uploaded .close'),
};
