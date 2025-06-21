import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, ChevronLeft, HelpCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizInProgressPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await axios.get(`http://localhost:5000/quizzes/${roomCode}`);
        setQuizData(res.data);
      } catch (error) {
        console.error("Erro ao buscar quiz:", error);
      }
    }

    fetchQuiz();
  }, [roomCode]);

  if (!quizData) {
    return <div className="mt-10 text-lg font-medium text-center">Carregando quiz...</div>;
  }

  const currentQuestion = quizData.questions[currentIndex];
  const totalQuestions = quizData.questions.length;
  const questionNumber = currentIndex + 1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Button variant="outline" onClick={() => navigate(`/aluno/lobby/${roomCode}`)} className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" /> Voltar ao Lobby (Sair do Quiz)
      </Button>
      
      <Card className="overflow-hidden">
        <CardHeader className="p-6 bg-gradient-to-r from-primary via-purple-600 to-secondary text-primary-foreground">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">Quiz em Andamento!</CardTitle>
            <div className="px-3 py-1 text-lg font-semibold rounded-md bg-black/20">
              Sala: {roomCode}
            </div>
          </div>
          <CardDescription className="mt-1 text-primary-foreground/80">
            Pergunta {questionNumber} de {totalQuestions}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          <div className="p-6 mb-6 rounded-lg shadow bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center text-2xl font-semibold">
                <HelpCircle className="mr-3 h-7 w-7 text-accent" /> {currentQuestion.text}
              </h2>
              <div className="flex items-center text-lg font-medium text-accent">
                <Clock className="w-5 h-5 mr-2" /> 30s
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="justify-start w-full h-auto py-4 text-base text-left transition-all duration-150 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/50"
                  onClick={() => alert(`Você selecionou: ${option}`)} 
                >
                  <span className="mr-3 font-bold text-primary">{String.fromCharCode(65 + index)}.</span> {option}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end p-6 bg-muted/20">
          <Button 
            size="lg" 
            className="btn-gradient-primary-accent"
            onClick={() => {
              if (currentIndex + 1 < quizData.questions.length) {
                setCurrentIndex(currentIndex + 1);
              } else {
                navigate(`/aluno/resultados/${roomCode}`);
              }
            }}
          >
            Enviar Resposta <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        </CardFooter>
      </Card>

      <p className="mt-4 text-xs text-center text-muted-foreground">
        Esta é uma visualização real do quiz conectado ao banco de dados. 💾✨
      </p>
    </motion.div>
  );
};

export default QuizInProgressPage;
