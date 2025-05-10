// Draw face detection on canvas
function drawDetection(detection) {
  const canvas = document.getElementById('overlay');
  const context = canvas.getContext('2d');
  
  // Clear previous drawings
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (detection) {
    // Draw red rectangle around face
    context.strokeStyle = '#FF0000';
    context.lineWidth = 2;
    context.strokeRect(
      detection.box.x,
      detection.box.y,
      detection.box.width,
      detection.box.height
    );
  }
}

// Start continuous face detection
export function startFaceDetection() {
  const video = document.getElementById('video');
  setInterval(async () => {
    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());
    drawDetection(detection);
  }, 100); // Update every 100ms
}

// Capture face descriptor from webcam feed
export async function captureFaceDescriptor() {
  const video = document.getElementById('video');
  
  try {

  // Detect the face and extract the descriptor
  const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
      // If no face is detected, return null
  if (!detections) {
    alert('No face detected. Please try again.');
    return null;
  }

  // Capture the face image
  const canvas = document.createElement('canvas');
  canvas.width = video.width;
  canvas.height = video.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Get the face region
  const box = detections.detection.box;
  const faceCanvas = document.createElement('canvas');
  faceCanvas.width = box.width;
  faceCanvas.height = box.height;
  const faceCtx = faceCanvas.getContext('2d');
  faceCtx.drawImage(canvas, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
  
  // Convert face image to base64
  const imageData = faceCanvas.toDataURL('image/jpeg');
  // Ensure descriptor is Float32Array and return with image
  return {
    descriptor: new Float32Array(detections.descriptor),
    imageData: imageData
  };
  } catch (error) {
    console.error('Error during face detection:', error);
    alert('Error during face detection. Please try again.');
    return null;
  }
}
