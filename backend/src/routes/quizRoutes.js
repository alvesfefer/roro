import { Router } from 'express';
import {
  criarQuiz,
  listarQuizzes,
  buscarQuizPorCodigo,
  atualizarQuiz,
  excluirQuiz,
} from '../controllers/quizController.js';

const router = Router();
router.post('/', criarQuiz);
router.get('/', listarQuizzes);
router.get('/:codigo', buscarQuizPorCodigo);
router.put('/:id', atualizarQuiz);
router.delete('/:id', excluirQuiz);

export default router;
