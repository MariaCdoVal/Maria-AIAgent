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
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é a Maria, especialista em logística e supply chain. Seja objetiva e prestativa.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro da OpenAI:", data);
    return res.status(500).json({ error: data.error?.message || "Erro na API da OpenAI" });
  }

  const reply = data.choices?.[0]?.message?.content || "Sem resposta gerada.";
  res.status(200).json({ reply });

} catch (error) {
  console.error("Erro geral:", error);
  res.status(500).json({ error: 'Erro ao gerar resposta com IA' });
}


