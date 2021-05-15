const PRE = "PRIVATE";
const SUF = "MEET";
let room_id;
let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
let local_stream;
document.getElementById("remote-video").hidden = true;
document.getElementById("local-video").hidden = true;
function createRoom() {
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
        alert("Enter Room Number");
        return;
    }
    room_id = PRE + room + SUF;
    let peer = new Peer(room_id);
    peer.on('open', (id) => {
        notify("Someone Connected with ID: ", id);
        hideModal();
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream);
        }, (err) => {
            notify(err);
        })
        notify("Waiting for person to join.");
    })
    peer.on('call', (call) => {
        call.answer(local_stream);
        call.on('stream', (stream) => {
            setRemoteStream(stream);
        });
    });
}

function setLocalStream(stream) {
    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}

function setRemoteStream(stream) {
    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
}

function hideModal() {
    document.getElementById("entry-modal").hidden = true;
    document.getElementById("remote-video").hidden = false;
    document.getElementById("local-video").hidden = false;
}

function notify(msg) {
    let notification = document.getElementById("notification");
    notification.innerHTML = msg;
    notification.hidden = false;
    setTimeout(() => {
        notification.hidden = true;
    }, 3000);
}

function joinRoom() {
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
        alert("Enter Room Number");
        return;
    }
    room_id = PRE + room + SUF;
    hideModal();
    let peer = new Peer();
    peer.on('open', (id) => {
        notify("Connected with Id: " + id);
        getUserMedia(
            { 
                video: true, 
                audio: true, 
                echoCancellation: true, 
                noiseSupression: true 
            }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream);
            notify("Joining...");
            let call = peer.call(room_id, stream);
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            })
        }, (err) => {
            notify(err);
        });
    });
}