import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST /api/professores
export async function criarProfessor(req, res) {
  const { nome, email, senha } = req.body;
  try {
    const professor = await prisma.professor.create({
      data: { nome, email, senha },
    });
    res.status(201).json(professor);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar', detalhe: err.message });
  }
}

// GET /api/professores
export async function listarProfessores(_, res) {
  const professores = await prisma.professor.findMany({
    include: { quizzes: true },
  });
  res.json(professores);
}

// GET /api/professores/:id
export async function obterProfessor(req, res) {
  const professor = await prisma.professor.findUnique({
    where: { id: Number(req.params.id) },
    include: { quizzes: true },
  });
  professor
    ? res.json(professor)
    : res.status(404).json({ mensagem: 'Professor não encontrado' });
}
