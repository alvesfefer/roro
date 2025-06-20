
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, User, KeyRound, UserPlus } from 'lucide-react';

const ProfessorLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem('professorUserToken')) { // Usar um nome mais específico para o token
      navigate('/professor');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username.trim() === '' || password.trim() === '') {
        toast({
            title: "Campos Vazios",
            description: "Por favor, preencha o usuário e a senha.",
            variant: "destructive",
        });
        return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredProfessorUsers') || '[]');
    const foundUser = registeredUsers.find(user => user.username === username && user.password === password);

    if (foundUser) {
      localStorage.setItem('professorUserToken', JSON.stringify({ username: foundUser.username }));
      window.dispatchEvent(new Event("storage")); // Notificar Navbar
      toast({
        title: "Login Bem-sucedido!",
        description: `Bem-vindo, ${foundUser.username}!`,
        className: "bg-green-500 text-white"
      });
      navigate('/professor');
    } else {
      toast({
        title: "Credenciais Inválidas",
        description: "Usuário ou senha incorretos. Se você não tem uma conta, registre-se.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center text-gradient-primary-accent">Login do Professor</CardTitle>
          <CardDescription className="text-center">
            Acesse o painel de administração de quizzes.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" /> Usuário
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
                className="text-base p-3"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg flex items-center">
                <KeyRound className="mr-2 h-5 w-5 text-primary" /> Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="text-base p-3"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" size="lg" className="w-full btn-gradient-primary-accent">
              <LogIn className="mr-2 h-5 w-5" /> Entrar
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Não tem uma conta?{' '}
              <Link to="/professor/registrar" className="font-medium text-primary hover:underline">
                Registre-se aqui
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProfessorLoginPage;
  