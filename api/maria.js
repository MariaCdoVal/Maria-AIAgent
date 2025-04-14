
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userMessage } = req.body;
    const reply = generateMariaResponse(userMessage);
    res.status(200).json({ reply });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

function generateMariaResponse(message) {
  if (message.toLowerCase().includes("estoque")) {
    return "Vamos analisar o estoque e buscar otimizações baseadas nos dados disponíveis.";
  } else if (message.toLowerCase().includes("logística")) {
    return "Você gostaria de sugestões para melhorar sua operação logística?";
  } else {
    return `Recebi sua mensagem: "${message}". A Maria está pensando na melhor resposta!`;
  }
}
