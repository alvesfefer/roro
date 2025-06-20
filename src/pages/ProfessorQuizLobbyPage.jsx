
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Users, Copy, Play, XCircle, Settings, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import QRCodeStylized from '@/components/quiz/QRCodeStylized';
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

const ProfessorQuizLobbyPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeValue, setQrCodeValue] = useState('');

  useEffect(() => {
    const fetchSessionData = () => {
      const sessions = JSON.parse(localStorage.getItem('quizSessions') || '{}');
      const currentSession = sessions[roomCode];
      if (currentSession) {
        setSession(currentSession);
        const joinUrl = `${window.location.origin}/aluno/entrar?roomCode=${roomCode}`;
        setQrCodeValue(joinUrl);

        if (currentSession.quizState === "in_progress") {
          navigate(`/aluno/quiz/${roomCode}`); 
        } else if (currentSession.quizState === "ended") {
          console.log("Quiz ended, professor should see results (not implemented yet)");
        }
      } else {
        toast({ title: "Erro", description: `Sala ${roomCode} não encontrada ou encerrada.`, variant: "destructive" });
        navigate('/professor');
      }
      setIsLoading(false);
    };

    fetchSessionData();
    const intervalId = setInterval(fetchSessionData, 2000); 

    return () => clearInterval(intervalId);
  }, [roomCode, navigate, toast]);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
      .then(() => {
        toast({ title: "Copiado!", description: "Código da sala copiado para a área de transferência." });
      })
      .catch(err => {
        toast({ title: "Erro", description: "Não foi possível copiar o código.", variant: "destructive" });
      });
  };
  
  const handleCopyJoinLink = () => {
    navigator.clipboard.writeText(qrCodeValue)
      .then(() => {
        toast({ title: "Link Copiado!", description: "Link de entrada copiado para a área de transferência." });
      })
      .catch(err => {
        toast({ title: "Erro", description: "Não foi possível copiar o link.", variant: "destructive" });
      });
  };


  const handleStartQuizGame = () => {
    if (!session || session.players.length === 0) {
        toast({title: "Atenção", description: "Não é possível iniciar o quiz sem jogadores na sala.", variant: "default"});
        return;
    }
    
    const sessions = JSON.parse(localStorage.getItem('quizSessions') || '{}');
    if (sessions[roomCode]) {
      sessions[roomCode].quizState = "in_progress";
      sessions[roomCode].currentQuestionIndex = 0; 
      localStorage.setItem('quizSessions', JSON.stringify(sessions));
      setSession(prevSession => ({...prevSession, quizState: "in_progress", currentQuestionIndex: 0 }));
      toast({title: "Quiz Iniciado!", description: `O quiz "${session.quizName}" começou.`});
    }
  };

  const handleCloseLobby = () => {
    const sessions = JSON.parse(localStorage.getItem('quizSessions') || '{}');
    delete sessions[roomCode];
    localStorage.setItem('quizSessions', JSON.stringify(sessions));
    toast({ title: "Lobby Fechado", description: `A sala ${roomCode} foi encerrada.` });
    navigate('/professor');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><p className="text-xl text-muted-foreground">Carregando lobby...</p></div>;
  }

  if (!session) {
    return null; 
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-br from-primary via-purple-600 to-secondary p-6">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary-foreground">{session.quizName}</CardTitle>
          <CardDescription className="text-lg text-primary-foreground/90">
            Lobby do Quiz - Compartilhe o código ou QR Code
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="text-center space-y-3">
              <Label htmlFor="roomCodeDisplay" className="text-lg text-muted-foreground">Código da Sala</Label>
              <div className="flex items-center justify-center space-x-2">
                <span id="roomCodeDisplay" className="text-4xl md:text-5xl font-extrabold text-gradient-primary-accent tracking-wider p-3 bg-muted rounded-lg shadow-inner">
                  {roomCode}
                </span>
                <Button variant="outline" size="icon" onClick={handleCopyRoomCode} aria-label="Copiar código da sala">
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="text-center space-y-3 flex flex-col items-center">
               <Label className="text-lg text-muted-foreground">QR Code para Entrada</Label>
              {qrCodeValue ? (
                <div className="p-3 bg-card border rounded-lg shadow-md inline-block">
                  <QRCodeStylized value={qrCodeValue} size={128} />
                </div>
              ) : (
                <div className="h-[128px] w-[128px] bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <Button variant="link" size="sm" onClick={handleCopyJoinLink} className="text-xs">
                Copiar Link de Entrada
              </Button>
            </div>
          </div>


          <div className="border-t border-border pt-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center justify-center text-primary">
              <Users className="mr-3 h-7 w-7" /> Jogadores Conectados ({session.players.length})
            </h3>
            {session.players.length > 0 ? (
              <div className="max-h-60 overflow-y-auto space-y-2 p-3 bg-background/40 rounded-md shadow-inner">
                {session.players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-3 bg-muted/70 rounded-md text-muted-foreground flex items-center justify-between"
                  >
                    <span>{player.name}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aguardando jogadores entrarem na sala...
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/20 rounded-b-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            size="lg" 
            className="w-full btn-gradient-primary-accent" 
            onClick={handleStartQuizGame}
            disabled={session.players.length === 0 || session.quizState !== 'lobby'}
          >
            <Play className="mr-2 h-5 w-5" /> 
            {session.quizState === 'lobby' ? 'Iniciar Quiz Agora' : 'Quiz em Andamento'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" variant="destructive" className="w-full">
                <XCircle className="mr-2 h-5 w-5" /> Fechar Lobby
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Fechar o Lobby?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja fechar este lobby? Todos os jogadores conectados serão desconectados e a sessão será encerrada.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleCloseLobby} className="bg-destructive hover:bg-destructive/90">
                  Sim, Fechar Lobby
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
        </CardFooter>
      </Card>
      <div className="mt-6 flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/professor">
              <Settings className="mr-2 h-4 w-4" /> Voltar ao Painel
            </Link>
          </Button>
      </div>
    </motion.div>
  );
};

export default ProfessorQuizLobbyPage;
  