const canvas = document.getElementById("videoCanvas");
const context = canvas.getContext("2d");
let pc; // WebRTC peer connection instance

async function initializeWebRTC() {
  const signalingServer =
    process.env.SIGNALING_SERVER_URL;

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  pc = new RTCPeerConnection(configuration);

  pc.ontrack = function (event) {
    const videoStream = event.streams[0];
    renderVideoOnCanvas(videoStream);
  };

  const ws = new WebSocket(signalingServer);

  ws.onopen = () => {
    console.log("Connected to signaling server");
    pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer);
      ws.send(JSON.stringify({ offer }));
    });
  };

  ws.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    if (message.answer) {
      await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
    }
  };
}

function renderVideoOnCanvas(stream) {
  const video = document.createElement("video");
  video.srcObject = stream;
  video.play();

  video.onloadedmetadata = function () {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(() => renderVideoOnCanvas(stream));
  };
}

initializeWebRTC();
