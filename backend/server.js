/* eslint-disable no-undef */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Define a simple Property schema
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

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(() => console.error('MongoDB connection error'));

// API endpoint to get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// API endpoint to add a property
app.post('/api/properties', async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch {
    res.status(400).json({ error: 'Failed to add property' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 