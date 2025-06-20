
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BarChart2, Home, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizResultsPage = () => {
  const { roomCode } = useParams();

  // Placeholder data
  const quizName = "Quiz de Conhecimentos Gerais";
  const userScore = 100; // Points or percentage
  const totalPossibleScore = 100;
  const rank = 1;
  const totalPlayers = 15;
  const leaderboard = [
    { name: "Você", score: userScore },
    { name: "Alice", score: 85 },
    { name: "Luna", score: 65 },
    { name: "Charlie", score: 75 },
    { name: "David", score: 70 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="text-center shadow-xl">
        <CardHeader className="p-8 text-white bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500">
          <Award className="w-20 h-20 mx-auto mb-4 text-yellow-300" />
          <CardTitle className="text-4xl font-bold">Quiz Finalizado!</CardTitle>
          <CardDescription className="text-xl text-white/90">
            Resultados para o quiz "{quizName}" (Sala: {roomCode})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8 md:p-8">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="p-6 rounded-lg bg-muted/30"
          >
            <h2 className="mb-2 text-2xl font-semibold text-primary">Sua Pontuação</h2>
            <p className="text-5xl font-bold text-gradient-primary-accent">
              {userScore} <span className="text-2xl text-muted-foreground">/ {totalPossibleScore}</span>
            </p>
            <p className="mt-1 text-lg text-muted-foreground">
              Você ficou em <strong className="text-foreground">{rank}º</strong> de {totalPlayers} jogadores.
            </p>
          </motion.div>

          <div>
            <h3 className="flex items-center justify-center mb-4 text-2xl font-semibold text-secondary">
              <BarChart2 className="mr-3 h-7 w-7" /> Leaderboard Parcial
            </h3>
            <ul className="space-y-3">
              {leaderboard.map((player, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  className={`flex justify-between items-center p-4 rounded-md ${player.name === "Você" ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/50'}`}
                >
                  <span className={`text-lg font-medium ${player.name === "Você" ? 'text-primary' : 'text-foreground'}`}>
                    {index + 1}. {player.name}
                  </span>
                  <span className={`text-lg font-bold ${player.name === "Você" ? 'text-primary' : 'text-accent'}`}>
                    {player.score} pts
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-4 mt-10 sm:flex-row">
            <Button size="lg" asChild className="btn-gradient-primary-secondary">
              <Link to="/aluno/entrar">
                <RotateCcw className="w-5 h-5 mr-2" /> Jogar Outro Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/">
                <Home className="w-5 h-5 mr-2" /> Voltar para o Início
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-center text-muted-foreground">Esta é uma visualização estática. A pontuação real e o leaderboard serão baseados nos dados do quiz.</p>
    </motion.div>
  );
};

export default QuizResultsPage;
  