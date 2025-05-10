// Start the webcam and display the video feed
export function startCamera() {
  return new Promise(async (resolve, reject) => {
    const video = document.getElementById('video');
    
    try {
      // Check if the browser supports media devices (camera access)
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support webcam access.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      
      // Wait for video to be ready
      video.onloadedmetadata = () => {
        console.log('Camera stream loaded successfully');
        resolve();
      };
    } catch (err) {
      console.error('Error accessing webcam: ', err);
      alert('Error accessing webcam. Please allow camera access.');
      reject(err);
    }
  });
}
