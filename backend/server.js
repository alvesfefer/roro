const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/professores', require('./routes/professorRoutes'));
app.use('/api/jogadores', require('./routes/jogadorRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
