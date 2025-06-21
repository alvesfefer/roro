import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST /api/quizzes
export async function criarQuiz(req, res) {
  const { titulo, codigo, perguntas, professorId } = req.body;
  try {
    const quiz = await prisma.quiz.create({
      data: { titulo, codigo, perguntas, professorId },
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar quiz', detalhe: err.message });
  }
}

// GET /api/quizzes
export async function listarQuizzes(req, res) {
  const quizzes = await prisma.quiz.findMany({
    include: { professor: { select: { id: true, nome: true } } },
  });
  res.json(quizzes);
}

// GET /api/quizzes/:codigo
export async function buscarQuizPorCodigo(req, res) {
  const { codigo } = req.params;
  const quiz = await prisma.quiz.findUnique({ where: { codigo } });
  if (!quiz) return res.status(404).json({ mensagem: 'Quiz não encontrado 😢' });
  res.json(quiz);
}

// PUT /api/quizzes/:id
export async function atualizarQuiz(req, res) {
  const { id } = req.params;
  const { titulo, perguntas } = req.body;
  try {
    const quiz = await prisma.quiz.update({
      where: { id: Number(id) },
      data: { titulo, perguntas },
    });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar', detalhe: err.message });
  }
}

// DELETE /api/quizzes/:id
export async function excluirQuiz(req, res) {
  const { id } = req.params;
  try {
    await prisma.quiz.delete({ where: { id: Number(id) } });
    res.json({ mensagem: 'Quiz removido.' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao excluir', detalhe: err.message });
  }
}
