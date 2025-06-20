
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Save, ArrowRight, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuestionEditForm = ({
  quizName,
  question,
  questionNumber,
  totalQuestions,
  onQuestionUpdate,
  onPrevious,
  onNext,
  onSaveQuiz,
  onAddQuestion,
  onDeleteQuestion,
  isFirstQuestion,
  isLastQuestion,
  onBackToDetails, 
  isEditingQuiz,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentQuestion(question);
  }, [question]);

  const handleTextChange = (value) => {
    const updated = { ...currentQuestion, text: value };
    setCurrentQuestion(updated);
    onQuestionUpdate(updated);
  };

  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[optIndex] = value;
    const updated = { ...currentQuestion, options: newOptions };
    setCurrentQuestion(updated);
    onQuestionUpdate(updated);
  };

  const handleCorrectAnswerChange = (optIndex) => {
    const updated = { ...currentQuestion, correctAnswerIndex: optIndex };
    setCurrentQuestion(updated);
    onQuestionUpdate(updated);
  };

  const handleAddOption = () => {
    if (currentQuestion.options.length < 6) { // Limitar a 6 opções
      const newOptions = [...currentQuestion.options, ''];
      const updated = { ...currentQuestion, options: newOptions };
      setCurrentQuestion(updated);
      onQuestionUpdate(updated);
    } else {
      toast({ title: "Limite Atingido", description: "Máximo de 6 opções por pergunta.", variant: "default" });
    }
  };

  const handleDeleteOption = (optIndex) => {
    if (currentQuestion.options.length > 2) { // Manter no mínimo 2 opções
      const newOptions = currentQuestion.options.filter((_, index) => index !== optIndex);
      let newCorrectAnswerIndex = currentQuestion.correctAnswerIndex;
      if (currentQuestion.correctAnswerIndex === optIndex) {
        newCorrectAnswerIndex = 0; // Resetar para a primeira se a correta for deletada
      } else if (currentQuestion.correctAnswerIndex > optIndex) {
        newCorrectAnswerIndex -= 1; // Ajustar índice se uma opção anterior for deletada
      }
      const updated = { ...currentQuestion, options: newOptions, correctAnswerIndex: newCorrectAnswerIndex };
      setCurrentQuestion(updated);
      onQuestionUpdate(updated);
    } else {
      toast({ title: "Mínimo Necessário", description: "São necessárias pelo menos 2 opções.", variant: "default" });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl text-gradient-primary-accent">
          {isEditingQuiz ? `Editando Perguntas - ${quizName}` : `Adicionar Perguntas - ${quizName}`}
        </CardTitle>
        <CardDescription>
          Pergunta {questionNumber} de {totalQuestions}. Preencha os detalhes abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`questionText-${questionNumber}`} className="text-lg">Texto da Pergunta</Label>
          <Input
            id={`questionText-${questionNumber}`}
            type="text"
            value={currentQuestion.text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Ex: Qual a capital da França?"
            className="text-base p-3"
          />
        </div>
        
        <Label className="text-lg">Opções de Resposta (Marque a correta)</Label>
        {currentQuestion.options.map((option, optIndex) => (
          <div key={optIndex} className="flex items-center space-x-3">
            <Checkbox
              id={`correctAnswer-${questionNumber}-${optIndex}`}
              checked={currentQuestion.correctAnswerIndex === optIndex}
              onCheckedChange={() => handleCorrectAnswerChange(optIndex)}
              aria-label={`Marcar opção ${optIndex + 1} como correta`}
            />
            <Input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(optIndex, e.target.value)}
              placeholder={`Opção ${optIndex + 1}`}
              className="text-base p-2 flex-grow"
            />
            {currentQuestion.options.length > 2 && (
              <Button variant="ghost" size="icon" onClick={() => handleDeleteOption(optIndex)} aria-label="Excluir opção">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
        {currentQuestion.options.length < 6 && (
          <Button variant="outline" size="sm" onClick={handleAddOption} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Opção
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={onPrevious} disabled={isFirstQuestion && (!onBackToDetails || isEditingQuiz)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {isFirstQuestion && onBackToDetails && !isEditingQuiz ? 'Voltar aos Detalhes' : 'Anterior'}
          </Button>
          {isLastQuestion ? (
            <Button onClick={onSaveQuiz} className="btn-gradient-primary-accent">
              <Save className="mr-2 h-5 w-5" /> Salvar Quiz Completo
            </Button>
          ) : (
            <Button onClick={onNext} className="btn-gradient-primary-secondary">
              Próxima Pergunta <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
        {isEditingQuiz && (
          <div className="flex justify-between w-full pt-4 border-t">
            <Button variant="outline" size="sm" onClick={onAddQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Pergunta
            </Button>
            {totalQuestions > 1 && (
                 <Button variant="destructive" size="sm" onClick={() => onDeleteQuestion(currentQuestion.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir Pergunta Atual
                </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuestionEditForm;
  