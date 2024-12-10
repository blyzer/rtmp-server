const canvas = document.getElementById('videoCanvas');
const context = canvas.getContext('2d');
let pc; // WebRTC peer connection
let videoElement; // Dynamically created video element

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
    // Call greenscreen effect once the video is ready
    drawVideo(videoElement);
    applyGreenscreenEffect(videoElement);
  });
}

function drawVideo(videoElement) {
  setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the video feed to the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Overlay dynamic timestamp
    const currentTime = new Date().toISOString();
    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.font = '20px Arial';
    context.fillText(currentTime, 10, 20);
  }, 1000);
}

// Greenscreen effect with pixel manipulation
function applyGreenscreenEffect(videoElement) {
  setInterval(() => {
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply chroma key logic - identify green and replace it
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      // If pixel is green enough, replace it (chroma key effect)
      if (green > 100 && red < 100 && blue < 100) {
        // Replace green pixel with custom background logic
        data[i] = 0; // Red channel
        data[i + 1] = 0; // Green channel
        data[i + 2] = 255; // Blue channel (blue background)
      }
    }

    context.putImageData(imageData, 0, 0);

    const currentTime = new Date().toISOString();
    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.font = '20px Arial';
    context.fillText(currentTime, 10, 20);
  }, 1000);
}

initializeWebRTC();