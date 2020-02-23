
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
