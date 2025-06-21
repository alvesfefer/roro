import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function criarJogador(req, res) {
  const { nome } = req.body;
  try {
    const jogador = await prisma.jogador.create({ data: { nome } });
    res.status(201).json(jogador);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar', detalhe: err.message });
  }
}

export async function listarJogadores(_, res) {
  const jogadores = await prisma.jogador.findMany({ include: { respostas: true } });
  res.json(jogadores);
}
