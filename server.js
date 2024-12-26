const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // To load environment variables from .env file

const app = express();

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5502', // Allow requests from your frontend (use your frontend's URL in production)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define schema and model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// POST endpoint to handle contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(200).json({ message: 'Form submission saved to database!' });
  } catch (error) {
    console.error('Error saving to database:', error);
    res.status(500).json({ error: 'Failed to save to database' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
