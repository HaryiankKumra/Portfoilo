import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connect, Schema, model } from 'mongoose';
import dotenv from 'dotenv'; // Use default import for dotenv
import fetch from 'node-fetch'; // Default import for node-fetch

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// CORS configuration
app.use(
  cors({
    origin: '*', // Allow all origins (can be modified for better security)
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type'], // Allow specific headers
  })
);

// Connect to MongoDB
connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define schema and model for contact form submissions
const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const Contact = model('Contact', contactSchema);

// POST endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new contact form submission and save to the database
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(200).json({ message: 'Form submission saved to database!' });
  } catch (error) {
    console.error('Error saving to database:', error);
    res.status(500).json({ error: 'Failed to save to database' });
  }
});

// Chatbot API route to handle messages and fetch responses from OpenAI API
app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return res.status(500).json({ error: 'Failed to fetch OpenAI response' });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('Error fetching chatbot response:', error);
    res.status(500).json({ error: 'Failed to process your request' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
