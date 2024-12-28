// api/contact.js
import { connectToDatabase } from '../lib/mongodb'; // assuming a database connection utility


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Connect to the database
      await connectToDatabase();
      
      const contact = new Contact({ name, email, message });
      await contact.save();
      res.status(200).json({ message: 'Form submission saved to database!' });
    } catch (error) {
      console.error('Error saving to database:', error);
      res.status(500).json({ error: 'Failed to save to database' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
