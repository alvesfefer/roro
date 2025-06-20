
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hourglass, Users, ChevronLeft, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const QuizLobbyPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    const playerDataString = localStorage.getItem('currentQuizPlayer');
    if (!playerDataString) {
      toast({ title: "Erro", description: "Dados do jogador não encontrados. Por favor, entre novamente.", variant: "destructive" });
      navigate('/aluno/entrar');
      return;
    }
    
    let playerData;
    try {
      playerData = JSON.parse(playerDataString);
    } catch (parseError) {
      toast({ title: "Erro", description: "Erro ao carregar dados do jogador. Por favor, entre novamente.", variant: "destructive" });
      localStorage.removeItem('currentQuizPlayer');
      navigate('/aluno/entrar');
      return;
    }


    if (!playerData || playerData.roomCode !== roomCode) {
      toast({ title: "Erro", description: "Você não está registrado nesta sala ou o código é inválido.", variant: "destructive" });
      navigate('/aluno/entrar');
      return;
    }
    setCurrentPlayer(playerData);

    const fetchSessionData = () => {
      const sessionsString = localStorage.getItem('quizSessions');
      if (!sessionsString) {
        setError(`Nenhuma sessão de quiz encontrada.`);
        setSession(null);
        toast({ title: "Erro na Sala", description: `Nenhuma sessão de quiz ativa.`, variant: "destructive"});
        setTimeout(() => navigate('/aluno/entrar'), 3000);
        return;
      }

      let sessions;
      try {
        sessions = JSON.parse(sessionsString);
      } catch (parseError) {
        setError(`Erro ao carregar dados das sessões.`);
        setSession(null);
        toast({ title: "Erro Interno", description: `Não foi possível carregar as sessões.`, variant: "destructive"});
        setTimeout(() => navigate('/aluno/entrar'), 3000);
        return;
      }
      
      const currentSession = sessions[roomCode];
      if (currentSession) {
        setSession(currentSession);
        setError(null);
        if (currentSession.quizState === "in_progress") {
          navigate(`/aluno/quiz/${roomCode}`);
        } else if (currentSession.quizState === "ended") {
          navigate(`/aluno/resultados/${roomCode}`);
        }
      } else {
        setError(`A sala ${roomCode} não foi encontrada ou foi encerrada.`);
        setSession(null);
        toast({ title: "Erro na Sala", description: `A sala ${roomCode} não existe mais.`, variant: "destructive"});
        setTimeout(() => navigate('/aluno/entrar'), 3000);
      }
    };

    fetchSessionData();
    const intervalId = setInterval(fetchSessionData, 2000); 

    return () => clearInterval(intervalId);
  }, [roomCode, navigate, toast]);

  const handleLeaveRoom = () => {
    const sessionsString = localStorage.getItem('quizSessions');
    if (sessionsString && currentPlayer) {
      try {
        const sessions = JSON.parse(sessionsString);
        if (sessions[roomCode]) {
          sessions[roomCode].players = sessions[roomCode].players.filter(p => p.id !== currentPlayer.playerId);
          localStorage.setItem('quizSessions', JSON.stringify(sessions));
        }
      } catch (e) {
        console.error("Erro ao atualizar jogadores ao sair da sala:", e);
      }
    }
    localStorage.removeItem('currentQuizPlayer');
    navigate('/aluno/entrar');
  };

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto text-center p-8"
      >
        <WifiOff className="h-24 w-24 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-destructive mb-4">Erro de Conexão</h1>
        <p className="text-muted-foreground text-lg mb-6">{error}</p>
        <Button onClick={() => navigate('/aluno/entrar')} className="btn-gradient-primary-secondary">
          Tentar Novamente
        </Button>
      </motion.div>
    );
  }
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Hourglass className="h-20 w-20 text-primary animate-spin mb-4" />
        <p className="text-xl text-muted-foreground">Carregando informações da sala...</p>
      </div>
    );
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Button variant="outline" onClick={handleLeaveRoom} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" /> Sair da Sala
      </Button>
      <Card>
        <CardHeader className="text-center">
          <Hourglass className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          <CardTitle className="text-3xl text-gradient-primary-accent">Aguardando Início do Quiz</CardTitle>
          <CardDescription className="text-lg">
            Você está na sala <strong className="text-secondary">{roomCode}</strong> para o quiz: <strong className="text-primary">{session.quizName}</strong>.
          </CardDescription>
          <p className="text-muted-foreground">O professor iniciará o quiz em breve.</p>
        </CardHeader>
        <CardContent>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center justify-center">
              <Users className="mr-2 h-6 w-6 text-accent" /> Jogadores na Sala ({session.players ? session.players.length : 0}):
            </h3>
            {session.players && session.players.length > 0 ? (
              <ul className="space-y-2 text-center max-h-60 overflow-y-auto p-2 bg-background/30 rounded-md">
                {session.players.map((player, index) => (
                  <motion.li 
                    key={player.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-3 rounded-md text-muted-foreground ${currentPlayer && player.name === currentPlayer.name ? 'bg-primary/20 text-primary font-semibold' : 'bg-muted/50'}`}
                  >
                    {player.name} {currentPlayer && player.name === currentPlayer.name && "(Você)"}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">Ainda não há jogadores na sala.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizLobbyPage;
  