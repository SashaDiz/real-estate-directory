/* eslint-disable no-undef */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

// Allow CORS from the deployed frontend domain
const allowedOrigins = [
  'https://real-estate-directory-fh69abds5-sashadizs-projects.vercel.app',
  'http://localhost:5173' // (optional) allow local dev too
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI;
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
  investmentReturn: String
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

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Register route (for initial setup, then remove or protect)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hash });
    res.status(201).json({ username: user.username });
  } catch {
    res.status(400).json({ error: 'User already exists' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
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

// Add property (protected)
app.post('/api/properties', auth, async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch {
    res.status(400).json({ error: 'Failed to add property' });
  }
}); 