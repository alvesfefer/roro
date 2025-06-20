
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, PlusCircle, Trash2 } from 'lucide-react';
import QuizDetailsForm from '@/components/quiz/QuizDetailsForm';
import QuestionEditForm from '@/components/quiz/QuestionEditForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

const useQuizForm = (quizId, navigate, toast) => {
  const [step, setStep] = useState(1);
  const [quizDetails, setQuizDetails] = useState({ id: quizId || crypto.randomUUID(), name: '', questions: [], createdAt: new Date().toISOString() });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (quizId) {
      const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
      const quizToEdit = quizzes.find(q => q.id === quizId);
      if (quizToEdit) {
        setQuizDetails(quizToEdit);
        setIsEditing(true);
        setStep(2);
        setCurrentQuestionIndex(quizToEdit.questions.length > 0 ? 0 : -1); 
      } else {
        toast({ title: "Erro", description: "Quiz para edição não encontrado.", variant: "destructive" });
        navigate('/professor');
      }
    } else {
      setQuizDetails({ id: crypto.randomUUID(), name: '', questions: [], createdAt: new Date().toISOString() });
      setIsEditing(false);
      setStep(1);
      setCurrentQuestionIndex(0);
    }
  }, [quizId, navigate, toast]);

  const handleDetailsSubmit = useCallback(({ name, numQuestions }) => {
    setQuizDetails(prev => {
      let newQuestions = prev.questions;
      if (!isEditing || prev.questions.length === 0) { 
        newQuestions = Array.from({ length: numQuestions > 0 ? numQuestions : 1 }, () => ({
          id: crypto.randomUUID(),
          text: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
        }));
      }
      return { ...prev, name, questions: newQuestions };
    });
    setCurrentQuestionIndex(0);
    setStep(2);
  }, [isEditing]);

  const handleQuestionUpdate = useCallback((updatedQuestion) => {
    setQuizDetails(prev => {
      const newQuestions = [...prev.questions];
      if (currentQuestionIndex >= 0 && currentQuestionIndex < newQuestions.length) {
        newQuestions[currentQuestionIndex] = updatedQuestion;
      }
      return { ...prev, questions: newQuestions };
    });
  }, [currentQuestionIndex]);

  const handleSaveQuiz = useCallback(() => {
    if (!quizDetails.name.trim()) {
      toast({ title: "Erro", description: "O nome do quiz não pode estar vazio.", variant: "destructive" });
      return;
    }
    if (quizDetails.questions.length > 0 && quizDetails.questions.some(q => !q.text.trim() || q.options.some(opt => !opt.trim()))) {
      toast({ title: "Erro", description: "Todas as perguntas e opções devem ser preenchidas.", variant: "destructive" });
      return;
    }

    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const existingQuizIndex = quizzes.findIndex(q => q.id === quizDetails.id);

    if (existingQuizIndex !== -1) {
      quizzes[existingQuizIndex] = quizDetails;
    } else {
      quizzes.push(quizDetails);
    }
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    toast({
      title: `Quiz ${isEditing ? 'Atualizado' : 'Salvo'}!`,
      description: `O quiz "${quizDetails.name}" foi ${isEditing ? 'atualizado' : 'salvo'} com sucesso.`,
      className: "bg-green-500 text-white"
    });
    navigate('/professor');
  }, [quizDetails, isEditing, navigate, toast]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizDetails.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, quizDetails.questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (step === 2 && !isEditing) {
      setStep(1);
    }
  }, [currentQuestionIndex, step, isEditing]);

  const handleBackToDetails = useCallback(() => {
    setStep(1);
  }, []);

  const handleAddQuestion = useCallback(() => {
    const newQuestion = {
      id: crypto.randomUUID(),
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
    };
    setQuizDetails(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
    setCurrentQuestionIndex(prev => prev.questions.length); 
  }, []);
  
  const handleDeleteQuestion = useCallback((questionIdToDelete) => {
    setQuizDetails(prev => {
        const newQuestions = prev.questions.filter(q => q.id !== questionIdToDelete);
        let newCurrentIndex = currentQuestionIndex;
        if (currentQuestionIndex >= newQuestions.length && newQuestions.length > 0) {
            newCurrentIndex = newQuestions.length - 1;
        } else if (newQuestions.length === 0) {
            newCurrentIndex = -1; 
        }
        setCurrentQuestionIndex(newCurrentIndex);
        return { ...prev, questions: newQuestions };
    });
    toast({ title: "Pergunta Excluída", description: "A pergunta foi removida do quiz.", className: "bg-yellow-500 text-black" });
  }, [currentQuestionIndex, toast]);


  return {
    step,
    quizDetails,
    currentQuestionIndex,
    isEditing,
    handleDetailsSubmit,
    handleQuestionUpdate,
    handleSaveQuiz,
    handleNextQuestion,
    handlePreviousQuestion,
    handleBackToDetails,
    handleAddQuestion,
    handleDeleteQuestion,
    setStep, 
    setCurrentQuestionIndex
  };
};

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { toast } = useToast();
  const {
    step,
    quizDetails,
    currentQuestionIndex,
    isEditing,
    handleDetailsSubmit,
    handleQuestionUpdate,
    handleSaveQuiz,
    handleNextQuestion,
    handlePreviousQuestion,
    handleBackToDetails,
    handleAddQuestion,
    handleDeleteQuestion,
  } = useQuizForm(quizId, navigate, toast);

  const currentQuestion = quizDetails.questions[currentQuestionIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-2 sm:px-0"
    >
      <Button variant="outline" onClick={() => navigate('/professor')} className="mb-4 sm:mb-6 text-sm sm:text-base">
        <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Voltar ao Painel
      </Button>

      {step === 1 && (
        <QuizDetailsForm
          initialName={quizDetails.name}
          initialNumQuestions={quizDetails.questions.length > 0 ? quizDetails.questions.length : 1}
          onSubmit={handleDetailsSubmit}
          isEditing={isEditing}
        />
      )}

      {step === 2 && (
        <>
          {currentQuestionIndex === -1 && isEditing && quizDetails.questions.length === 0 ? (
             <Card className="text-center p-6 sm:p-8">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Quiz Sem Perguntas</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Este quiz ainda não tem perguntas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Você pode adicionar perguntas agora ou salvar o quiz e editá-lo mais tarde.
                    </p>
                    <Button onClick={handleAddQuestion} className="w-full sm:w-auto btn-gradient-primary-accent">
                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Primeira Pergunta
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button onClick={handleSaveQuiz} variant="outline" className="w-full sm:w-auto">
                        <Save className="mr-2 h-4 w-4" /> Salvar Quiz Vazio
                    </Button>
                </CardFooter>
            </Card>
          ) : currentQuestion ? (
            <QuestionEditForm
              quizName={quizDetails.name}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizDetails.questions.length}
              onQuestionUpdate={handleQuestionUpdate}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              onSaveQuiz={handleSaveQuiz}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={(questionId) => {
                if (quizDetails.questions.length === 1) {
                    toast({ title: "Atenção", description: "Não é possível excluir a última pergunta. Adicione outra primeiro ou salve o quiz vazio.", variant: "default"});
                    return;
                }
                handleDeleteQuestion(questionId);
              }}
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === quizDetails.questions.length - 1}
              onBackToDetails={!isEditing ? handleBackToDetails : undefined}
              isEditingQuiz={isEditing}
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">Carregando perguntas...</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default CreateQuizPage;
  