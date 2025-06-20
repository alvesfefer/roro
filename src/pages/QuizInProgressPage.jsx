
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle, ChevronLeft, HelpCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizInProgressPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  // Placeholder data
  const currentQuestion = {
    text: "Qual é a capital da França?",
    options: ["Berlim", "Madri", "Paris", "Roma"],
    timeLimit: 30, // seconds
  };
  const questionNumber = 1;
  const totalQuestions = 10;

  // State for selected answer (to be implemented)
  // const [selectedAnswer, setSelectedAnswer] = useState(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
       <Button variant="outline" onClick={() => navigate(`/aluno/lobby/${roomCode}`)} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Lobby (Sair do Quiz)
      </Button>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary via-purple-600 to-secondary text-primary-foreground p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">Quiz em Andamento!</CardTitle>
            <div className="text-lg font-semibold bg-black/20 px-3 py-1 rounded-md">
              Sala: {roomCode}
            </div>
          </div>
          <CardDescription className="text-primary-foreground/80 mt-1">
            Pergunta {questionNumber} de {totalQuestions}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="mb-6 p-6 bg-muted/30 rounded-lg shadow">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold flex items-center">
                <HelpCircle className="mr-3 h-7 w-7 text-accent" /> {currentQuestion.text}
              </h2>
              <div className="flex items-center text-lg font-medium text-accent">
                <Clock className="mr-2 h-5 w-5" /> {currentQuestion.timeLimit}s
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-auto py-4 text-left justify-start text-base border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-150"
                  onClick={() => alert(`Você selecionou: ${option}`)} 
                >
                  <span className="mr-3 text-primary font-bold">{String.fromCharCode(65 + index)}.</span> {option}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/20 flex justify-end">
          <Button 
            size="lg" 
            className="btn-gradient-primary-accent"
            onClick={() => navigate(`/aluno/resultados/${roomCode}`)}
          >
            Enviar Resposta e Próxima <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
       <p className="text-xs text-muted-foreground mt-4 text-center">Esta é uma visualização estática. A lógica de progressão e pontuação será implementada.</p>
    </motion.div>
  );
};

export default QuizInProgressPage;
  