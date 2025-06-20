
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChevronLeft, ListChecks, CheckCircle2, XCircle, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const ViewQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const foundQuiz = quizzes.find(q => q.id === quizId);

    if (foundQuiz) {
      setQuiz(foundQuiz);
    } else {
      toast({ title: "Erro", description: "Quiz não encontrado.", variant: "destructive" });
      navigate('/professor');
    }
    setIsLoading(false);
  }, [quizId, navigate, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><p className="text-lg sm:text-xl text-muted-foreground">Carregando quiz...</p></div>;
  }

  if (!quiz) {
    return null; 
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-2 sm:px-0"
    >
      <Button variant="outline" onClick={() => navigate('/professor')} className="mb-4 sm:mb-6 text-sm sm:text-base">
        <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Voltar ao Painel
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-br from-primary via-purple-600 to-secondary p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground">{quiz.name}</CardTitle>
          <CardDescription className="text-base sm:text-lg text-primary-foreground/90">
            Visualizando detalhes do quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gradient-primary-secondary flex items-center mb-2 sm:mb-0">
              <ListChecks className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7" /> Perguntas ({quiz.questions.length})
            </h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Criado em: {new Date(quiz.createdAt).toLocaleDateString()}
            </span>
          </div>

          {quiz.questions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4 sm:py-6 text-sm sm:text-base">Este quiz ainda não possui perguntas.</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {quiz.questions.map((question, qIndex) => (
                <motion.div
                  key={question.id || qIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: qIndex * 0.1 }}
                >
                  <Card className="bg-muted/30">
                    <CardHeader className="p-3 sm:p-4">
                      <CardTitle className="text-base sm:text-lg">Pergunta {qIndex + 1}: <span className="font-normal">{question.text}</span></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-3 sm:p-4">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center p-2 sm:p-3 rounded-md text-xs sm:text-sm
                            ${optIndex === question.correctAnswerIndex 
                              ? 'bg-green-500/20 text-green-700 border border-green-500' 
                              : 'bg-background/50 border'
                            }`}
                        >
                          {optIndex === question.correctAnswerIndex ? (
                            <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-destructive/50 flex-shrink-0" />
                          )}
                          <span className="flex-grow break-words">{option}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 sm:p-6 bg-muted/20 rounded-b-lg flex justify-end">
            <Button asChild className="btn-gradient-primary-accent text-sm sm:text-base">
                <Link to={`/professor/editar-quiz/${quiz.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Editar Quiz
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ViewQuizPage;
  