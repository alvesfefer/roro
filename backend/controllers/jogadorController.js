const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarJogador(req, res) {
  const { nome } = req.body;
  try {
    const jogador = await prisma.jogador.create({ data: { nome } });
    res.status(201).json(jogador);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar jogador', detalhe: err.message });
  }
}

async function enviarResposta(req, res) {
  const { id } = req.params; // id do jogador
  const { quizId, respostas, nota } = req.body;

  try {
    const resposta = await prisma.resposta.create({
      data: {
        jogadorId: Number(id),
        quizId: Number(quizId),
        respostas,
        nota
      }
    });
    res.status(201).json(resposta);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao enviar resposta', detalhe: err.message });
  }
}

module.exports = {
  criarJogador,
  enviarResposta
};
