
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, UserCog, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
      >
        <h1 className="mb-6 text-5xl font-extrabold md:text-7xl">
        Bem-vindo ao{' '}
      <span className="text-6xl text-gradient-primary-accent md:text-7xl">
       Quiz App
       </span>
        !
          </h1>

        <p className="max-w-2xl mx-auto mb-12 text-xl md:text-2xl text-muted-foreground">
          Crie, participe e divirta-se com quizzes interativos. Desafie seus conhecimentos e compita com amigos!
        </p>
      </motion.div>

      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="transition-shadow duration-300 hover:shadow-primary/30 hover:shadow-xl">
            <CardHeader>
              <UserCog className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-3xl text-center">Área do Professor</CardTitle>
              <CardDescription className="text-center">
                Crie e gerencie seus quizzes. Inicie sessões e acompanhe o progresso dos alunos.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" asChild className="w-full btn-gradient-primary-accent md:w-auto">
                <Link to="/professor">
                  Acessar Painel <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="transition-shadow duration-300 hover:shadow-secondary/30 hover:shadow-xl">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <CardTitle className="text-3xl text-center">Área do Aluno</CardTitle>
              <CardDescription className="text-center">
                Participe de quizzes! Insira o código da sala, seu nome e mostre o que sabe.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" asChild className="w-full btn-gradient-primary-secondary md:w-auto">
                <Link to="/aluno/entrar">
                  Entrar no Quiz <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
       <motion.div 
        className="w-full max-w-3xl p-6 mt-16 rounded-lg glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="mb-3 text-2xl font-semibold text-gradient-primary-secondary">Como Funciona?</h2>
        <ol className="space-y-2 text-left list-decimal list-inside text-muted-foreground">
          <li><strong className="text-foreground">Professor:</strong> Cria um quiz com perguntas e respostas.</li>
          <li><strong className="text-foreground">Professor:</strong> Inicia uma sessão e compartilha o código da sala.</li>
          <li><strong className="text-foreground">Aluno:</strong> Entra na sala com seu nome e o código.</li>
          <li><strong className="text-foreground">Todos:</strong> O quiz começa! Responda às perguntas em tempo real.</li>
          <li><strong className="text-foreground">Ao Final:</strong> Veja os resultados e quem foi o campeão!</li>
        </ol>
      </motion.div>
    </div>
  );
};

export default HomePage;
  