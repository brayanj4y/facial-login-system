import { startCamera } from './camera.js';
import { captureFaceDescriptor, startFaceDetection } from './faceDetection.js';
import { registerUser, loginUser } from './auth.js';

// Wait for face-api.js to load models and start the camera
window.onload = async () => {
  try {
    console.log('Loading face-api.js models...');
    await loadModels();    console.log('Starting camera...');
    await startCamera();
    console.log('Camera started successfully!');
    console.log('Starting face detection...');
    startFaceDetection();
    console.log('Face detection started!');
  } catch (error) {
    console.error('Initialization error:', error);
    document.getElementById('status').textContent = 'Error initializing the system. Please refresh the page.';
    return;
  }

  // Register button click event
  document.getElementById('registerBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    if (username === '') return alert('Please enter a username!');
    
    const descriptor = await captureFaceDescriptor();
    if (descriptor) {
      const success = await registerUser(username, descriptor);
      if (success) {
        document.getElementById('status').textContent = 'Registration successful!';
      } else {
        document.getElementById('status').textContent = 'Registration failed. Try again.';
      }
    }
  });

  // Login button click event
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    if (username === '') return alert('Please enter a username!');

    const descriptor = await captureFaceDescriptor();
    if (descriptor) {
      const isLoginSuccess = await loginUser(username, descriptor);
      if (isLoginSuccess) {
        document.getElementById('status').textContent = 'Login successful!';
      } else {
        document.getElementById('status').textContent = 'Face not recognized. Try again.';
      }
    }
  });
};

// Load face-api.js models
async function loadModels() {
  try {
    const modelPath = '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
    ]);
    console.log('All models loaded successfully!');
  } catch (error) {
    console.error('Error loading models:', error);
    alert('Error loading face recognition models. Please refresh the page.');
    throw error;
  }
}
