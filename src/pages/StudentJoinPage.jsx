
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, User, Hash } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const StudentJoinPage = () => {
  const [studentName, setStudentName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const codeFromUrl = queryParams.get('roomCode');
    if (codeFromUrl) {
      setRoomCodeInput(codeFromUrl.toUpperCase());
    }
  }, [location.search]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !roomCodeInput.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha seu nome e o código da sala.",
        variant: "destructive",
      });
      return;
    }

    const sessions = JSON.parse(localStorage.getItem('quizSessions') || '{}');
    const roomCodeUpper = roomCodeInput.toUpperCase();

    if (sessions[roomCodeUpper]) {
      const session = sessions[roomCodeUpper];
      if (session.quizState === 'ended') {
        toast({
          title: "Quiz Encerrado",
          description: "Este quiz já foi encerrado pelo professor.",
          variant: "destructive",
        });
        return;
      }

      const playerExists = session.players.find(p => p.name.toLowerCase() === studentName.trim().toLowerCase());
      if (playerExists) {
        const existingPlayerData = JSON.parse(localStorage.getItem('currentQuizPlayer'));
        if (existingPlayerData && existingPlayerData.playerId === playerExists.id && existingPlayerData.roomCode === roomCodeUpper) {
            toast({
                title: "Reconectando...",
                description: `Bem-vindo de volta, ${studentName}!`,
            });
            navigate(`/aluno/lobby/${roomCodeUpper}`);
            return;
        }

        toast({
          title: "Nome em Uso",
          description: "Este nome já está sendo usado nesta sala. Por favor, escolha outro.",
          variant: "destructive",
        });
        return;
      }
      
      const newPlayer = { id: crypto.randomUUID(), name: studentName.trim(), score: 0, answers: [] };
      session.players.push(newPlayer);
      localStorage.setItem('quizSessions', JSON.stringify(sessions));
      
      localStorage.setItem('currentQuizPlayer', JSON.stringify({ name: studentName.trim(), roomCode: roomCodeUpper, playerId: newPlayer.id }));

      toast({
        title: "Entrando na Sala...",
        description: `Olá ${studentName}! Conectando à sala ${roomCodeUpper}.`,
        className: "bg-green-500 text-white"
      });
      navigate(`/aluno/lobby/${roomCodeUpper}`);
    } else {
      toast({
        title: "Sala não encontrada",
        description: `Não foi encontrada nenhuma sala com o código "${roomCodeUpper}". Verifique o código e tente novamente.`,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center text-gradient-primary-secondary">Entrar no Quiz</CardTitle>
          <CardDescription className="text-center">
            Digite seu nome e o código da sala fornecido pelo professor para participar.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" /> Seu Nome
              </Label>
              <Input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="text-base p-3"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomCode" className="text-lg flex items-center">
                <Hash className="mr-2 h-5 w-5 text-secondary" /> Código da Sala
              </Label>
              <Input
                id="roomCode"
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="Ex: AB12CD"
                className="text-base p-3"
                maxLength={6}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full btn-gradient-primary-secondary">
              <LogIn className="mr-2 h-5 w-5" /> Entrar na Sala
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default StudentJoinPage;
  