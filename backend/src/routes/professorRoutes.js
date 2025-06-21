import { Router } from 'express';
import {
  criarProfessor,
  listarProfessores,
  obterProfessor,
} from '../controllers/professorController.js';

const router = Router();

router.post('/', criarProfessor);
router.get('/', listarProfessores);
router.get('/:id', obterProfessor);

export default router;
