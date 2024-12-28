import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connect, Schema, model } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'; // Import dotenv only once

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
const geminiApiKey = process.env.GEMINI_API_KEY;

// Check if API key is present before starting the server
if (!geminiApiKey) {
  console.error('Error: Missing GEMINI_API_KEY environment variable.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Select a suitable Gemini model for chatbot interactions
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Adjust model name as needed

    const prompt = {
      // Craft a clear prompt for generating chatbot responses
      text: `Respond to the user's message in a conversational manner:\n${message}`,
      // Consider adding additional context or instructions if necessary
    };

    const response = await model.generateContent(prompt);
    const generatedText = response.response.text();

    res.status(200).json({ reply: generatedText });
  } catch (error) {
    console.error('Error fetching chatbot response:', error);
    res.status(500).json({ error: 'Failed to process your request' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
