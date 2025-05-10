const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend

// Save user + face descriptor and image
app.post('/api/register', (req, res) => {
  const { username, descriptor, imageData } = req.body;
  const serialized = JSON.stringify(descriptor);
  
  // Save image to public/uploads folder
  const imageFileName = `${username}-${Date.now()}.jpg`;
  const imageUrl = `/uploads/${imageFileName}`;
  const imagePath = path.join(__dirname, '../public/uploads', imageFileName);
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, '../public/uploads'))) {
    fs.mkdirSync(path.join(__dirname, '../public/uploads'), { recursive: true });
  }
  
  // Remove header from base64 string and save image
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");
  fs.writeFileSync(imagePath, base64Data, 'base64');

  const sql = 'INSERT INTO users (username, descriptor, imageUrl) VALUES (?, ?, ?)';
  db.run(sql, [username, serialized, imageUrl], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Username already exists or invalid data.' });
    }
    res.json({ success: true, id: this.lastID, imageUrl });
  });
});

// Get descriptor by username
app.get('/api/user/:username', (req, res) => {
  const username = req.params.username;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Parse the stored descriptor array
    const descriptorArray = JSON.parse(row.descriptor);
    
    res.json({
      username: row.username,
      descriptor: descriptorArray, // Send as regular array, will convert to Float32Array client-side
      imageUrl: row.imageUrl
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
