import { Router } from 'express';
import {
  criarJogador,
  listarJogadores,
} from '../controllers/jogadorController.js';

const router = Router();

router.post('/', criarJogador);
router.get('/', listarJogadores);

export default router;
