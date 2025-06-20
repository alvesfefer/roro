const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function criarProfessor(req, res) {
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 8);

  try {
    const novoProfessor = await prisma.professor.create({
      data: { nome, email, senha: hash }
    });
    res.status(201).json(novoProfessor);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar professor', detalhe: err.message });
  }
}

async function loginProfessor(req, res) {
  const { email, senha } = req.body;
  const professor = await prisma.professor.findUnique({ where: { email } });

  if (!professor) {
    return res.status(404).json({ erro: 'Professor não encontrado' });
  }

  const senhaValida = await bcrypt.compare(senha, professor.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Senha incorreta' });
  }

  res.json({ mensagem: 'Login realizado com sucesso', professor });
}

module.exports = {
  criarProfessor,
  loginProfessor
};
