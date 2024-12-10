const canvas = document.getElementById('videoCanvas');
const context = canvas.getContext('2d');
let pc; 
let videoElement;

async function initializeWebRTC() {
  const signalingServer = process.env.SIGNALING_SERVER_URL;

  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  pc = new RTCPeerConnection(configuration);

  pc.ontrack = function(event) {
    const remoteStream = event.streams[0];
    renderVideo(remoteStream);
  };

  const ws = new WebSocket(signalingServer);

  ws.onopen = async () => {
    console.log('Connected to signaling server');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    ws.send(JSON.stringify({ offer }));
  };

  ws.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    if (message.answer) {
      await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
    }
  };
}

function renderVideo(stream) {
  videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.autoplay = true;
  videoElement.muted = true;

  videoElement.addEventListener('loadedmetadata', () => {
    drawVideo(videoElement);
    applyGreenscreenEffect(videoElement);
  });
}

function drawVideo(videoElement) {
  setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const currentTime = new Date().toISOString();
    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.font = '20px Arial';
    context.fillText(currentTime, 10, 20);
  }, 1000);
}

function applyGreenscreenEffect(videoElement) {
  videoElement.addEventListener('play', () => {
    const greenscreenEffect = () => {
      if (videoElement.paused || videoElement.ended) return setTimeout(greenscreenEffect, 100);

      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

      const frame = context.getImageData(0, 0, videoWidth, videoHeight);
      const length = frame.data.length;

      for (let i = 0; i < length; i += 4) {
        const r = frame.data[i];
        const g = frame.data[i + 1];
        const b = frame.data[i + 2];

        if (g > 120 && r < 100 && b < 100) {
          frame.data[i + 3] = 0; // Make pixels transparent
        }
      }

      context.putImageData(frame, 0, 0);
      requestAnimationFrame(greenscreenEffect);
    };

    greenscreenEffect();
  });
}

initializeWebRTC();