export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // 1. Check if the key exists in Vercel
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: { message: "OpenAI API Key is missing in Vercel Settings" } });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await response.json();

    // 2. FORWARD OPENAI ERRORS
    // If OpenAI returns 401 (Invalid Key) or 429 (Rate Limit), we forward that status
    if (!response.ok) {
      return res.status(response.status).json(data); 
    }
    
    // 3. Success
    return res.status(200).json(data);

  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ error: { message: "Internal Server Error" } });
  }
}