import { Router } from 'express';
// ...existing code...
import {
  criarResposta,
  listarRespostas,
} from '../controllers/respostaController.js';
// ...existing code...
const router = Router();

router.post('/', criarResposta);
router.get('/', listarRespostas);

export default router;
