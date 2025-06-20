
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, ListChecks, Play, Trash2, Edit3, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

const ProfessorAdminPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [activeSessions, setActiveSessions] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    setQuizzes(loadedQuizzes);
    const loadedSessions = JSON.parse(localStorage.getItem('quizSessions') || '{}');
    setActiveSessions(loadedSessions);
  }, []);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleDeleteQuiz = (quizId) => {
    const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);

    const updatedSessions = { ...activeSessions };
    Object.keys(updatedSessions).forEach(roomCode => {
      if (updatedSessions[roomCode].quizId === quizId) {
        delete updatedSessions[roomCode];
      }
    });
    localStorage.setItem('quizSessions', JSON.stringify(updatedSessions));
    setActiveSessions(updatedSessions);

    toast({
      title: "Quiz Excluído",
      description: "O quiz e quaisquer sessões ativas foram removidos.",
      className: "bg-red-500 text-white"
    });
  };
  
  const handleStartQuiz = (quizId) => {
    const quizToStart = quizzes.find(q => q.id === quizId);
    if (!quizToStart) {
      toast({ title: "Erro", description: "Quiz não encontrado.", variant: "destructive" });
      return;
    }

    const existingSession = Object.entries(activeSessions).find(([, sessionData]) => sessionData.quizId === quizId);
    if (existingSession) {
        const [roomCode] = existingSession;
        navigate(`/professor/lobby/${roomCode}`);
        return;
    }

    const roomCode = generateRoomCode();
    const newSession = {
      quizId: quizId,
      quizName: quizToStart.name,
      questions: quizToStart.questions,
      players: [],
      currentQuestionIndex: 0,
      quizState: "lobby", 
      createdAt: new Date().toISOString(),
    };
    
    const updatedSessions = { ...activeSessions, [roomCode]: newSession };
    localStorage.setItem('quizSessions', JSON.stringify(updatedSessions));
    setActiveSessions(updatedSessions);
    
    navigate(`/professor/lobby/${roomCode}`);
  };

  const getQuizSessionRoomCode = (quizId) => {
    const sessionEntry = Object.entries(activeSessions).find(([,sessionData]) => sessionData.quizId === quizId);
    return sessionEntry ? sessionEntry[0] : null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-2 sm:px-0"
    >
      <header className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-primary-accent mb-3 sm:mb-4">Painel do Professor</h1>
        <p className="text-base sm:text-lg text-muted-foreground">Gerencie seus quizzes e sessões.</p>
      </header>

      <div className="mb-6 sm:mb-8">
        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="h-full flex flex-col bg-primary/10 border-primary">
            <CardHeader className="items-center p-4 sm:p-6">
              <PlusCircle className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-3" />
              <CardTitle className="text-xl sm:text-2xl">Criar Novo Quiz</CardTitle>
              <CardDescription className="text-center text-sm sm:text-base">
                Elabore um novo quiz com perguntas e alternativas personalizadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end justify-center p-4 sm:p-6">
              <Button size="lg" asChild className="w-full btn-gradient-primary-accent text-base sm:text-lg">
                <Link to="/professor/criar-quiz">Criar Quiz</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-lg glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gradient-primary-secondary flex items-center mb-2 sm:mb-0">
            <ListChecks className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8" /> Meus Quizzes
          </h2>
          <span className="text-xs sm:text-sm bg-primary/20 text-primary font-semibold px-2 py-1 sm:px-3 rounded-full">
            {quizzes.length} {quizzes.length === 1 ? 'Quiz' : 'Quizzes'}
          </span>
        </div>

        {quizzes.length === 0 ? (
          <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">
            Você ainda não criou nenhum quiz. Clique em "Criar Quiz" para começar!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <AnimatePresence>
              {quizzes.map((quiz, index) => {
                const roomCode = getQuizSessionRoomCode(quiz.id);
                return (
                  <motion.div
                    key={quiz.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-primary/20 hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4 sm:p-5">
                        <CardTitle className="text-lg sm:text-xl truncate" title={quiz.name}>{quiz.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {quiz.questions.length} {quiz.questions.length === 1 ? 'pergunta' : 'perguntas'}
                        </CardDescription>
                        <CardDescription className="text-xs">
                          Criado em: {new Date(quiz.createdAt).toLocaleDateString()}
                        </CardDescription>
                        {roomCode && (
                          <CardDescription className="text-xs text-primary font-semibold mt-1">
                            Sessão Ativa: {roomCode}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex-grow p-4 sm:p-5">
                      </CardContent>
                      <CardFooter className="grid grid-cols-2 gap-2 p-3 sm:p-4 pt-2 sm:pt-4">
                         <Button 
                          variant="outline" 
                          className="w-full text-xs sm:text-sm py-1.5 sm:py-2" 
                          onClick={() => navigate(`/professor/visualizar-quiz/${quiz.id}`)}
                         >
                          <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Visualizar
                        </Button>
                        <Button 
                          className="w-full btn-gradient-primary-secondary text-xs sm:text-sm py-1.5 sm:py-2"
                          onClick={() => handleStartQuiz(quiz.id)}
                        >
                          <Play className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> {roomCode ? "Ver Lobby" : "Iniciar"}
                        </Button>
                         <Button 
                          variant="outline" 
                          className="w-full text-xs sm:text-sm py-1.5 sm:py-2" 
                          onClick={() => navigate(`/professor/editar-quiz/${quiz.id}`)}
                         >
                          <Edit3 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full text-xs sm:text-sm py-1.5 sm:py-2">
                              <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o quiz "{quiz.name}" e fechará qualquer sessão ativa.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id)} className="bg-destructive hover:bg-destructive/90">
                                Sim, Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProfessorAdminPage;
  