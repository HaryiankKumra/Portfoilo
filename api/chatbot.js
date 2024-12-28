// Import dependencies
const fetch = require('node-fetch'); // Use node-fetch to interact with external APIs (like OpenAI)
require('dotenv').config();  // Ensure you load environment variables from .env

// Chatbot endpoint (POST request)
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// POST API route for chatbot
app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Make a request to the OpenAI API (or another chatbot service)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,  // Use the OpenAI API key from environment variables
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 150,  // Limit response length (adjust as needed)
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return res.status(500).json({ error: 'Failed to fetch OpenAI response' });
    }

    // Return the bot's reply as the API response
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error('Error fetching chatbot response:', error);
    return res.status(500).json({ error: 'Failed to process your request' });
  }
});

// Server setup (listening on port 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
