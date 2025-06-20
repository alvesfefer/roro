const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarQuiz(req, res) {
  const { titulo, codigo, perguntas, professorId } = req.body;

  try {
    const novoQuiz = await prisma.quiz.create({
      data: {
        titulo,
        codigo,
        perguntas,
        professorId
      }
    });
    res.status(201).json(novoQuiz);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar quiz', detalhe: err.message });
  }
}

async function listarQuizzes(req, res) {
  const quizzes = await prisma.quiz.findMany();
  res.json(quizzes);
}

async function buscarQuizPorCodigo(req, res) {
  const { codigo } = req.params;
  const quiz = await prisma.quiz.findUnique({
    where: { codigo }
  });
  if (!quiz) {
    return res.status(404).json({ mensagem: 'Quiz não encontrado 😢' });
  }
  res.json(quiz);
}

module.exports = {
  criarQuiz,
  listarQuizzes,
  buscarQuizPorCodigo
};
