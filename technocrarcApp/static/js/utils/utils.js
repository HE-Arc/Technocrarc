export default betweenClosed = (x, min, max) => x >= min && x <= max

export default sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default async function getData(route) {
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

// Displays the preloader(s)
export default function activatePreloader() {
    document.querySelector('.preloader-container').style.display = 'block';
}

// Hides the preloader(s)
export default function deactivatePreloader() {
    document.querySelector('.preloader-container').style.display = 'none';
}

export default function closeModal(id) {
    let modal = document.getElementById(id)
    let instance = M.Modal.getInstance(modal)
    instance.close();
}