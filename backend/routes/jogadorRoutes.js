const express = require('express');
const router = express.Router();
const {
  criarJogador,
  enviarResposta
} = require('../controllers/jogadorController');

router.post('/', criarJogador);
router.post('/:id/respostas', enviarResposta);

module.exports = router;
