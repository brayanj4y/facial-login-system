// Register a new user with face descriptor and image
export async function registerUser(username, { descriptor, imageData }) {
  try {
    // Check if face already exists in the system
    const faceExists = await checkFaceExists(descriptor);
    if (faceExists) {
      console.error('This face is already registered with another username');
      return { success: false, error: 'Face already registered' };
    }

    // Convert descriptor to Array before sending
    const descriptorArray = Array.from(descriptor);
    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, descriptor: descriptorArray, imageData }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('User registered:', data);
      return true;
    } else {
      console.error('Registration failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
}

// Compare face descriptors
function compareFaceDescriptors(queryDescriptor, storedDescriptor) {
  if (!queryDescriptor || !storedDescriptor) return false;
  
  try {
    // Convert stored descriptor back to Float32Array
    const storedFloat32 = new Float32Array(storedDescriptor);
    const queryFloat32 = new Float32Array(queryDescriptor);
    
    // Calculate Euclidean distance between descriptors
    const distance = faceapi.euclideanDistance(queryFloat32, storedFloat32);
    console.log('Face match distance:', distance);
    
    // Threshold for face match (lower = more strict)
    const threshold = 0.6;
    return distance < threshold;
  } catch (error) {
    console.error('Error comparing descriptors:', error);
    return false;
  }
}

// Check if face already exists in system
async function checkFaceExists(descriptor) {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const users = await response.json();
    
    // Check against each existing user's face descriptor
    for (const user of users) {
      if (user.descriptor) {
        const isMatch = compareFaceDescriptors(descriptor, user.descriptor);
        if (isMatch) {
          return true; // Face already exists
        }
      }
    }
    
    return false; // Face doesn't exist
  } catch (error) {
    console.error('Error checking face existence:', error);
    throw error;
  }
}

// Login with an existing user (match face descriptor)
export async function loginUser(username, { descriptor }) {
  try {
    const response = await fetch(`http://localhost:3000/api/user/${username}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('User not found');
      return false;
    }

    const userData = await response.json();
    
    // Compare the live face descriptor with the stored one
    const isMatch = compareFaceDescriptors(descriptor, userData.descriptor);
    
    if (isMatch) {
      console.log('Face match successful!');
      // Show the user's registered photo
      const userImage = document.createElement('img');
      userImage.src = userData.imageUrl;
      userImage.style.width = '150px';
      userImage.style.marginTop = '10px';
      document.getElementById('status').appendChild(userImage);
      return true;
    } else {
      console.log('Face does not match.');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}
