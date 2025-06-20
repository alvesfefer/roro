
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, UserCog, Users, LogOut, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProfessorLoggedIn, setIsProfessorLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInUserToken = localStorage.getItem('professorUserToken');
      setIsProfessorLoggedIn(!!loggedInUserToken);
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('professorUserToken');
    setIsProfessorLoggedIn(false);
    toast({ title: "Logout Realizado", description: "Você foi desconectado da área do professor." });
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ to, children, onClick }) => (
    <Button variant="ghost" asChild onClick={() => { setIsMobileMenuOpen(false); if(onClick) onClick(); }}>
      <Link to={to} className="flex items-center justify-start w-full px-4 py-2 sm:justify-center sm:py-0 sm:px-0">
        {children}
      </Link>
    </Button>
  );
  
  const navItems = (
    <>
      <NavLink to="/">
        <Home className="w-4 h-4 mr-2" /> Início
      </NavLink>
      {isProfessorLoggedIn ? (
        <>
          <NavLink to="/professor">
            <UserCog className="w-4 h-4 mr-2" /> Painel Prof.
          </NavLink>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center justify-start w-full px-4 py-2 sm:justify-center sm:py-0 sm:px-0">
            <LogOut className="w-4 h-4 mr-2" /> Sair (Prof.)
          </Button>
        </>
      ) : (
        <NavLink to="/professor/login">
          <LogIn className="w-4 h-4 mr-2" /> Professor
        </NavLink>
      )}
      <NavLink to="/aluno/entrar">
        <Users className="w-4 h-4 mr-2" /> Aluno
      </NavLink>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 shadow-lg bg-card/50 backdrop-blur-md">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <Link to="/" className="text-xl font-bold sm:text-2xl text-gradient-primary-secondary" onClick={() => setIsMobileMenuOpen(false)}>
          Quiz App
        </Link>
        
        <div className="hidden space-x-1 sm:flex">
          {navItems}
        </div>

        <div className="sm:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 z-40 flex flex-col items-start p-4 space-y-2 shadow-lg sm:hidden top-full bg-card/95 backdrop-blur-sm"
          >
            {navItems}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
  