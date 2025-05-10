# Facial Login Web App
![image](https://github.com/user-attachments/assets/2efc2961-58d3-476d-8d0b-5130bf8a008a)


A browser-based facial recognition login system using [face-api.js](https://github.com/justadudewhohacks/face-api.js) for real-time face detection and descriptor matching, with persistent storage using a Node.js + SQLite backend.

## 🚀 Features

* Real-time face detection in browser via webcam
* Face descriptor extraction with `face-api.js`
* SQLite database for storing face descriptors and user photos
* User registration with face + username
* Login by verifying captured face against stored descriptor
* Persistent server-side storage for user data and face images

## 📁 Project Structure

```
facial-login-system/
├── public/
│   ├── models/                 # Pre-trained face-api.js models
│   ├── index.html              # Main HTML interface
│   └── style.css               # UI styling
│
├── src/
│   └── js/
│       ├── main.js             # App bootstrap logic
│       ├── camera.js           # Webcam access
│       ├── faceDetection.js    # Face capture and descriptor extraction
│       └── auth.js             # Registration and login handling
│
├── server/                    
│   ├── server.js               # Express backend API
│   ├── db.js                   # SQLite database setup and queries
│   └── uploads/                # Stores captured face images
│
├── .gitignore
├── package.json
├── README.md
```

## ⚙️ Installation

```bash
git clone https://github.com/your-username/face-login-app.git
cd facial-login-system
npm install
```

## 🧠 Setup Instructions

1. **Download Face-API Models**
   Place required face-api.js models into `public/models/`:

   * `face_landmark_68_model-weights`
   * `face_recognition_model`
   * `tiny_face_detector_model`

   [Download Models](https://github.com/justadudewhohacks/face-api.js-models)

2. **Run the App**

```bash
npm start
```

Visit `http://localhost:3000` in your browser.

## 🧪 Usage

1. **Register**:

   * Enter a username
   * Face the webcam and click "Register"
   * Your face descriptor and photo will be saved

2. **Login**:

   * Enter the same username
   * Face the webcam and click "Login"
   * System will compare your face to stored descriptor and authenticate

## 📦 API Endpoints

### POST `/api/register`

Registers a new user.

**Body:**

```json
{
  "username": "Brayan",
  "descriptor": [0.123, ...],
  "photoUrl": "data:image/jpeg;base64,..."
}
```

### GET `/api/user/:username`

Fetches descriptor and photo for the given user.

**Response:**

```json
{
  "descriptor": [0.123, ...],
  "photoUrl": "uploads/Brayan.jpg"
}
```

## 🔐 Notes & Limitations

* Face descriptors must be stored and parsed correctly (`Float32Array`) for accurate comparison
* Euclidean distance is used to compare similarity (threshold \~0.6)
* Not suitable for production authentication without HTTPS and stronger security

## 📸 Credits

* [face-api.js](https://github.com/justadudewhohacks/face-api.js)
* Project template and structure by @brayanj4y

---

Happy Coding 👨‍💻
