
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/shared/Layout';
import HomePage from '@/pages/HomePage';
import ProfessorAdminPage from '@/pages/ProfessorAdminPage';
import CreateQuizPage from '@/pages/CreateQuizPage';
import ProfessorQuizLobbyPage from '@/pages/ProfessorQuizLobbyPage';
import StudentJoinPage from '@/pages/StudentJoinPage';
import QuizLobbyPage from '@/pages/QuizLobbyPage';
import QuizInProgressPage from '@/pages/QuizInProgressPage';
import QuizResultsPage from '@/pages/QuizResultsPage';
import ProfessorLoginPage from '@/pages/ProfessorLoginPage';
import ProfessorRegisterPage from '@/pages/ProfessorRegisterPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ViewQuizPage from '@/pages/ViewQuizPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/professor/login" element={<ProfessorLoginPage />} />
          <Route path="/professor/registrar" element={<ProfessorRegisterPage />} />
          
          <Route path="/professor" element={<ProtectedRoute><ProfessorAdminPage /></ProtectedRoute>} />
          <Route path="/professor/criar-quiz" element={<ProtectedRoute><CreateQuizPage /></ProtectedRoute>} />
          <Route path="/professor/editar-quiz/:quizId" element={<ProtectedRoute><CreateQuizPage /></ProtectedRoute>} />
          <Route path="/professor/visualizar-quiz/:quizId" element={<ProtectedRoute><ViewQuizPage /></ProtectedRoute>} />
          <Route path="/professor/lobby/:roomCode" element={<ProtectedRoute><ProfessorQuizLobbyPage /></ProtectedRoute>} />

          <Route path="/aluno/entrar" element={<StudentJoinPage />} />
          <Route path="/aluno/lobby/:roomCode" element={<QuizLobbyPage />} />
          <Route path="/aluno/quiz/:roomCode" element={<QuizInProgressPage />} />
          <Route path="/aluno/resultados/:roomCode" element={<QuizResultsPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
  