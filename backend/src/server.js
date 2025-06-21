import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
dotenv.config();

import professorRoutes from './routes/professorRoutes.js';
import quizRoutes      from './routes/quizRoutes.js';
import jogadorRoutes   from './routes/jogadorRoutes.js';
import respostaRoutes  from './routes/respostaRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/professores', professorRoutes);
app.use('/api/quizzes',     quizRoutes);
app.use('/api/jogadores',   jogadorRoutes);
app.use('/api/respostas',   respostaRoutes);

app.get('/', (req, res) => res.send('API Quiz v1 - OK'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
