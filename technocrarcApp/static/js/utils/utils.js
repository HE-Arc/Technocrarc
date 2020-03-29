export const $$ = {
    soundUploadForms: document.querySelectorAll('.form-upload-sound'),
    soundFileInputs: document.querySelectorAll('.sound-file-input'),
    fileFields: document.querySelectorAll('.file-field'),
    dragDropFigure: document.querySelector('.dragdrop-figure'),
    dragDropUploaded: document.querySelector('.dragdrop-uploaded'),
    dragDropCloses: document.querySelectorAll('.dragdrop-uploaded .close'),
}

export const betweenClosed = (x, min, max) => x >= min && x <= max;

export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function getData(route) {
    let options = {
        method: 'GET',
        headers: {
            'X-CSRFToken': Cookies.get('csrftoken')
        },
        credentials: 'same-origin'
    }

    let data = await fetch(route, options)
        .then(response => response.json())
        .then(
            data => {
                return data
            }
        ).catch(
            error => M.toast({ html: error.message })
        )

    return data
}

export function activatePreloader() {
    // Displays the preloader(s)
    document.querySelector('.preloader-container').style.display = 'block';
}

export function deactivatePreloader() {
    // Hides the preloader(s)
    document.querySelector('.preloader-container').style.display = 'none';
}

export function closeModal(id) {
    let modal = document.getElementById(id)
    let instance = M.Modal.getInstance(modal)
    instance.close();
}

export function sortByValue(dict, sortComparison) {
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    })

    return items.sort(sortComparison)
}