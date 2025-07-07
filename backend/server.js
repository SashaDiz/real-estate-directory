/* eslint-disable no-undef */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Allow CORS from the deployed frontend domain
const allowedOrigins = [
  'https://real-estate-directory-umber.vercel.app/',
  'http://localhost:5173', // (optional) allow local dev too
  'http://localhost:8080', // allow local docker frontend
  'http://77.233.222.106:8080' // внешний адрес фронта
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/realestate';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String // hashed
});
const User = mongoose.model('User', userSchema);

// Property schema
const propertySchema = new mongoose.Schema({
  title: String,
  type: String,
  status: String,
  price: Number,
  area: Number,
  location: String,
  address: String,
  layout: String,
  description: String,
  images: [String],
  coordinates: [Number],
  agent: {
    name: String,
    phone: String,
    email: String
  },
  isFeatured: Boolean,
  investmentReturn: String,
  views: { type: Number, default: 0 },
  contactRequests: { type: Number, default: 0 }
}, { timestamps: true });
const Property = mongoose.model('Property', propertySchema);

// Connect to MongoDB and start server only after successful connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
  });

// Register route (for initial setup, then remove or protect)
// app.post('/api/register', async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
//   const hash = await bcrypt.hash(password, 10);
//   try {
//     const user = await User.create({ username, password: hash });
//     res.status(201).json({ username: user.username });
//   } catch {
//     res.status(400).json({ error: 'User already exists' });
//   }
// });

// Login route (только admin/password)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Get all properties (public)
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Add property (unprotected for testing)
app.post('/api/properties', async (req, res) => {

  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch {
    res.status(400).json({ error: 'Failed to add property' });
  }
});

// Edit property (unprotected for testing)
app.put('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch {
    res.status(400).json({ error: 'Failed to update property' });
  }
});

// Delete property (unprotected for testing)
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: 'Failed to delete property' });
  }
});

// Upload images (unprotected for testing)
app.post('/api/upload-images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    
    const imageUrls = req.files.map(file => {
      return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    });
    
    res.json({ imageUrls });
  } catch {
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete image (unprotected for testing)
app.delete('/api/delete-image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Increment property views (unprotected for testing)
app.post('/api/properties/:id/view', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json({ views: property.views });
  } catch {
    res.status(400).json({ error: 'Failed to increment views' });
  }
});

// Increment property contact requests (unprotected for testing)
app.post('/api/properties/:id/contact-request', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { contactRequests: 1 } },
      { new: true }
    );
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json({ contactRequests: property.contactRequests });
  } catch {
    res.status(400).json({ error: 'Failed to increment contact requests' });
  }
}); 