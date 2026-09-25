import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExchangeProvider } from './context/ExchangeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';

// Pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { SkillDevelopment } from './pages/SkillDevelopment';
import { FindPartners } from './pages/FindPartners';
import { StudentDetails } from './pages/StudentDetails';
import { Profile } from './pages/Profile';
import { Requests } from './pages/Requests';
import { Exchanges } from './pages/Exchanges';
import { Ratings } from './pages/Ratings';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { UserProfile } from './types/user';

function AppContent() {
  const { user, isAuthenticated, allUsers } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  const handleNavigate = (page: string) => {
    // Protected routes check: if user navigates to private pages without auth, send to login
    const protectedPages = ['dashboard', 'skill-development', 'profile', 'requests', 'exchanges', 'ratings'];
    if (protectedPages.includes(page) && !isAuthenticated) {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStudent = (student: UserProfile) => {
    setSelectedStudent(student);
    setCurrentPage('student-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewStudentById = (studentId: string) => {
    const student = allUsers.find((u) => u.id === studentId);
    if (student) {
      handleSelectStudent(student);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentPage === 'landing' && <Landing onNavigate={handleNavigate} />}

        {currentPage === 'how-it-works' && <Landing onNavigate={handleNavigate} />}

        {currentPage === 'partners' && (
          <FindPartners
            onSelectStudent={handleSelectStudent}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'student-details' && selectedStudent && (
          <StudentDetails
            student={selectedStudent}
            onBack={() => setCurrentPage('partners')}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigate}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {currentPage === 'skill-development' && (
          <SkillDevelopment
            onNavigate={handleNavigate}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />}

        {currentPage === 'requests' && (
          <Requests
            onNavigate={handleNavigate}
            onViewStudent={handleViewStudentById}
          />
        )}

        {currentPage === 'exchanges' && (
          <Exchanges
            onNavigate={handleNavigate}
            onViewStudent={handleSelectStudent}
          />
        )}

        {currentPage === 'ratings' && <Ratings onNavigate={handleNavigate} />}

        {currentPage === 'about' && <About onNavigate={handleNavigate} />}

        {currentPage === 'login' && <Login onNavigate={handleNavigate} />}

        {currentPage === 'signup' && <Signup onNavigate={handleNavigate} />}

        {currentPage === 'forgot-password' && (
          <ForgotPassword onNavigate={handleNavigate} />
        )}
      </main>

      {/* Persistent AI RAG Chatbot "SkillMate AI" across the application */}
      <Chatbot />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ExchangeProvider>
        <AppContent />
      </ExchangeProvider>
    </AuthProvider>
  );
}
