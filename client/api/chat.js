// File: client/api/chat.js

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // 2. Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Vercel injects this key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await response.json();
    
    // 3. Return the AI's response to your frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ error: 'Error connecting to AI' });
  }
}