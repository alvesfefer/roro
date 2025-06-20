const express = require('express');
const router = express.Router();
const {
  criarQuiz,
  listarQuizzes,
  buscarQuizPorCodigo
} = require('../controllers/quizController');

router.post('/', criarQuiz);
router.get('/', listarQuizzes);
router.get('/:codigo', buscarQuizPorCodigo);

module.exports = router;
