
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserPlus, User, KeyRound, Eye, EyeOff } from 'lucide-react';

const ProfessorRegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({ title: "Campos Vazios", description: "Por favor, preencha todos os campos.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Senhas Divergentes", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
        toast({ title: "Senha Curta", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('registeredProfessorUsers') || '[]');
    if (existingUsers.find(user => user.username === username)) {
      toast({ title: "Usuário Existente", description: "Este nome de usuário já está em uso.", variant: "destructive" });
      return;
    }

    const newUser = { username, password }; // ATENÇÃO: Senha armazenada em texto plano!
    existingUsers.push(newUser);
    localStorage.setItem('registeredProfessorUsers', JSON.stringify(existingUsers));

    toast({
      title: "Registro Bem-sucedido!",
      description: `Usuário ${username} registrado. Faça login para continuar.`,
      className: "bg-green-500 text-white"
    });
    navigate('/professor/login');
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
          <CardTitle className="text-3xl text-center text-gradient-primary-accent">Registrar Professor</CardTitle>
          <CardDescription className="text-center">
            Crie sua conta para gerenciar quizzes.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reg-username" className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" /> Nome de Usuário
              </Label>
              <Input
                id="reg-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Escolha um nome de usuário"
                className="text-base p-3"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-lg flex items-center">
                <KeyRound className="mr-2 h-5 w-5 text-primary" /> Senha
              </Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha (mín. 6 caracteres)"
                  className="text-base p-3 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-confirm-password" className="text-lg flex items-center">
                <KeyRound className="mr-2 h-5 w-5 text-primary" /> Confirmar Senha
              </Label>
              <div className="relative">
                <Input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className="text-base p-3 pr-10"
                  required
                />
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" size="lg" className="w-full btn-gradient-primary-accent">
              <UserPlus className="mr-2 h-5 w-5" /> Registrar
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Já tem uma conta?{' '}
              <Link to="/professor/login" className="font-medium text-primary hover:underline">
                Faça login aqui
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProfessorRegisterPage;
  