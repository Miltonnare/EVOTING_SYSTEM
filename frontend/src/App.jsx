import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { VoterDashboard } from './pages/VoterDashboard';
import { BallotPage } from './pages/BallotPage';
import { ResultsDashboard } from './pages/ResultsDashboard';
import { AuditLedgerPage } from './pages/AuditLedgerPage';
import { AdminDashboard } from './pages/AdminDashboard';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'login':
        return <LoginPage onSwitchToRegister={() => setActiveTab('register')} onSuccess={() => setActiveTab('dashboard')} />;
      case 'register':
        return <RegisterPage onSwitchToLogin={() => setActiveTab('login')} onSuccess={() => setActiveTab('dashboard')} />;
      case 'ballot':
        return <BallotPage onNavigate={setActiveTab} />;
      case 'results':
        return <ResultsDashboard />;
      case 'audit':
        return <AuditLedgerPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'dashboard':
      default:
        return <VoterDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>{renderContent()}</main>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
