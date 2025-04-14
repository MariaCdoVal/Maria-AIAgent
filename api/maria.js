export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // ou 'gpt-4' se você tiver acesso
        messages: [
          { role: 'system', content: 'Você é a Maria, uma agente de IA especializada em logística e otimização de processos. Responda de forma objetiva e prestativa.' },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    res.status(500).json({ error: 'Erro ao gerar resposta com IA' });
  }
}

