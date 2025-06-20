const express = require('express');
const router = express.Router();
const {
  criarProfessor,
  loginProfessor
} = require('../controllers/professorController');

router.post('/register', criarProfessor);
router.post('/login', loginProfessor);

module.exports = router;
