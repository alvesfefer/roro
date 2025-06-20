
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuizDetailsForm = ({ initialName = '', initialNumQuestions = 1, onSubmit, isEditing = false }) => {
  const [name, setName] = useState(initialName);
  const [numQuestions, setNumQuestions] = useState(initialNumQuestions);
  const { toast } = useToast();

  useEffect(() => {
    setName(initialName);
    if (!isEditing) { // Only reset numQuestions if not editing (or if it's a new quiz being detailed)
        setNumQuestions(initialNumQuestions > 0 ? initialNumQuestions : 1);
    }
  }, [initialName, initialNumQuestions, isEditing]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Erro", description: "O nome do quiz não pode estar vazio.", variant: "destructive" });
      return;
    }
    if (!isEditing && numQuestions < 1) {
      toast({ title: "Erro", description: "O número de perguntas deve ser ao menos 1.", variant: "destructive" });
      return;
    }
    onSubmit({ name, numQuestions: isEditing ? 0 : numQuestions }); // Pass 0 if editing, as questions already exist
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl text-gradient-primary-accent">
          {isEditing ? 'Editar Detalhes do Quiz' : 'Criar Novo Quiz - Detalhes'}
        </CardTitle>
        <CardDescription>
          {isEditing ? 'Altere o nome do seu quiz.' : 'Defina o nome e o número de perguntas para o seu novo quiz.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quizName" className="text-lg">Nome do Quiz</Label>
            <Input
              id="quizName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Quiz de Conhecimentos Gerais"
              className="text-base p-3"
              required
            />
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="numQuestions" className="text-lg">Número de Perguntas</Label>
              <Input
                id="numQuestions"
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                max="50" 
                className="text-base p-3"
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" className="w-full btn-gradient-primary-accent">
            {isEditing ? 'Salvar Nome e Ir para Perguntas' : 'Adicionar Perguntas'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuizDetailsForm;
  