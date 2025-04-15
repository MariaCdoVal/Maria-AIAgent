export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage } = req.body;

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const ASSISTANT_ID = 'asst_hW86opMCIGqioZNwuwGFhoOd';

  try {
    // 1. Criar uma thread
    const threadRes = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const thread = await threadRes.json();

    // 2. Enviar mensagem do usuário à thread
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'user',
        content: userMessage
      })
    });

    // 3. Iniciar o run com seu assistant
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    const run = await runRes.json();

    // 4. Aguardar até o run ser concluído
    let runStatus = 'queued';
    let finalRun;

    while (runStatus !== 'completed' && runStatus !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const statusRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      });

      finalRun = await statusRes.json();
      runStatus = finalRun.status;
    }

    if (runStatus === 'failed') {
      return res.status(500).json({ error: 'Execução da IA falhou' });
    }

    // 5. Buscar a resposta final
    const messagesRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    const messagesData = await messagesRes.json();
    const lastMessage = messagesData.data.reverse().find(msg => msg.role === 'assistant');

    const reply = lastMessage?.content[0]?.text?.value || 'A Maria não conseguiu responder agora.';

    res.status(200).json({ reply });

  } catch (error) {
    console.error('Erro geral:', error);
    res.status(500).json({ error: 'Erro ao se comunicar com a assistente Maria.' });
  }
}
