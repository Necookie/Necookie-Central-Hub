export const config = {
  runtime: 'edge', // USES VERCEL EDGE RUNTIME (FASTER)
};

export default async function handler(req) {
  // 1. Handle CORS Preflight (Required because Frontend & Backend might be on different ports/domains)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // 2. Block Non-POST Requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 3. Parse Incoming Data (Edge Runtime uses .json())
    const { messages } = await req.json();

    // 4. Verify API Key (Set this in Vercel > Settings > Environment Variables)
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OpenAI API Key is missing in Vercel Settings" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. Forward Request to OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7 // Controls creativity (0.7 is a good balance)
      })
    });

    const data = await openaiResponse.json();

    // 6. Handle OpenAI Errors
    if (!openaiResponse.ok) {
      return new Response(JSON.stringify(data), { 
        status: openaiResponse.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      });
    }

    // 7. Return Success
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });

  } catch (error) {
    console.error("Vercel Function Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
  }
}