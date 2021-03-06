import {$$, closeModal} from "/static/js/utils/utils.js"

export class SongUploader {

    constructor(pubsub) {
        this._bindEvents()
        this.init()
        this.pubSub = pubsub
    }

    init() {
        // Inits Tooltips
        M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
            enterDelay: 300,
        })

        // Inits modals
        var elems = document.querySelectorAll('.modal')
        var instances = M.Modal.init(elems)

        // Elements with class « file-field »
        $$.fileFields.forEach((item, i) => {
            // Drag enter -> modify style
            item.addEventListener('dragenter', evt => {
                evt.preventDefault()
                item.classList.add('dragenter')
            })

            // Drag leave -> modify style
            item.addEventListener('dragleave', evt => {
                evt.preventDefault()
                item.classList.remove('dragenter')
            })

            // Drop on « file input »
            item.addEventListener('drop', evt => {
                evt.preventDefault()

                let input = item.querySelector('.sound-file-input')
                let files = evt.dataTransfer.files
                this.parseAudioFiles(input, files)
            });
        });

        // Elements with class « sound-file-input »
        $$.soundFileInputs.forEach((item, i) => {
            // File uploaded by file dialog
            item.addEventListener('change', (evt) => {
                evt.preventDefault()

                let files = evt.target.files
                this.parseAudioFiles(item, files)
            })
        })

        // Elements with class « close »
        $$.dragDropCloses.forEach((item, i) => {
            let input = item.parentElement.parentElement.parentElement.querySelector('.sound-file-input')

            // Drag & Drop « close » icon
            item.addEventListener('click', evt => {
                this.showDragDropFigure(input)
            })
        })
    }

    upload() {
        // Uploads a sound file to the server in order to split it
        this.enableUploadButton(false)
        let fileInput = document.getElementById('sound-file-input')

        let file = fileInput.files[0]
        let formData = new FormData();
        formData.append('file', file);

        let options = {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken')
            },
            body: formData,
            credentials: 'same-origin'
        }

        fetch('upload', options).then(
            response => {
                if (response.ok) {
                    M.toast({ html: "Successfully uploaded song" })
                    this.enableUploadButton(true)
                    closeModal("uploadFileDialog")
                    document.getElementById('uploadSongClose').click()
                    this.pubSub.publish("prepareEditor", null)
                }
                else {
                    M.toast({ html: "An error occured while uploading your song" })
                    this.enableUploadButton(true)
                }
            }
        ).catch(
            error => M.toast({ html: error.message })
        )
    }

    enableUploadButton(enable) {
        let button = document.getElementById('uploadSongButton')
        let preLoader = document.getElementById('uploadSongPreloader')

        if (enable) {
            button.disabled = false;
            preLoader.style.display = "none"
        }
        else {
            button.disabled = true;
            preLoader.style.display = "block"
        }
    }

    parseAudioFiles(input, files) {
        if (files.length > 1) {
            alert('You can only upload one audio file at a time.');
        }
        else {
            let file = files[0];
            let fileName = file.name;
            let fileType = file.type;
            let fileSize = file.size;

            // Must be audio file
            if (! fileType.includes('audio')) {
                alert('The file format must be audio.');
            }
            // Size cannot exceed 50 MB
            else if (fileSize > 5e7) {
                alert('The file size cannot exceed 50 MB.')
            }
            // All right
            else {
                input.files = files;
                this.showUploadedFile(input);
            }
        }
    }

    showUploadedFile(input) {
        // Displays the uploaded sound file information
        let file = input.files[0];
        $$.dragDropUploaded.querySelector('.uploaded-file-name').innerHTML = file.name;
        $$.dragDropUploaded.querySelector('.uploaded-file-size').innerHTML = this._parseSize(file.size);

        $$.dragDropFigure.setAttribute('hidden', true);
        $$.dragDropUploaded.removeAttribute('hidden');
    }

    showDragDropFigure(input) {
        // Displays the Drag & Drop information
        input.value = '';

        $$.dragDropUploaded.setAttribute('hidden', true);
        $$.dragDropFigure.removeAttribute('hidden');
    }

    _bindEvents() {
        let uploadBtn = document.getElementById("uploadSongButton")
        uploadBtn.addEventListener("click", () => this.upload())
    }

    _parseSize(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        if (bytes == 0) { return '0 Byte' }

        let i = Math.floor(Math.log(bytes) / Math.log(1000))

        return (bytes / Math.pow(1000, i)).toFixed(2) + ' ' + sizes[i]
    }
}
