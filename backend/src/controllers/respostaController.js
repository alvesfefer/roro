import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST /api/respostas
export async function criarResposta(req, res) {
  const { jogadorId, quizId, respostas, nota } = req.body;
  try {
    const resposta = await prisma.resposta.create({
      data: { jogadorId, quizId, respostas, nota },
    });
    res.status(201).json(resposta);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao registrar resposta', detalhe: err.message });
  }
}

// GET /api/respostas
export async function listarRespostas(_, res) {
  const respostas = await prisma.resposta.findMany({
    include: { jogador: true, quiz: true },
  });
  res.json(respostas);
}
