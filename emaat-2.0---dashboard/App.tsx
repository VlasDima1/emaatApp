
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ParticipantList from './components/ParticipantList';
import ParticipantDetail from './components/ParticipantDetail';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Participant } from './types';
import { getParticipants } from './services/participantService';
import { UsersIcon } from './components/icons';

const SelectParticipantMessage: React.FC = () => (
    <div className="hidden md:flex h-full flex-col items-center justify-center text-center text-gray-500 bg-gray-50 rounded-lg">
      <UsersIcon className="h-20 w-20 mb-4 text-gray-300" />
      <h2 className="text-2xl font-medium text-gray-700">Selecteer een deelnemer</h2>
      <p className="mt-1">Kies een deelnemer uit de lijst om hun gezondheidsdashboard te bekijken.</p>
    </div>
  );

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-12 w-12 text-indigo-600 mb-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-gray-600">Laden...</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
  
    const fetchParticipants = async () => {
        setLoading(true);
        const data = await getParticipants();
        setParticipants(data);
        setLoading(false);
    };

    useEffect(() => {
      fetchParticipants();
    }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Header />
      <HashRouter>
        <div className="md:flex" style={{ height: 'calc(100vh - 4rem)' }}>
            <aside className="hidden md:block w-80 border-r border-gray-200 bg-white">
                <ParticipantList participants={participants} loading={loading} />
            </aside>
          
            <main className="w-full md:flex-1 md:overflow-y-auto md:p-6">
                <Routes>
                    <Route path="/" element={
                        <>
                            <div className="md:hidden"><ParticipantList participants={participants} loading={loading} /></div>
                            <SelectParticipantMessage />
                        </>
                    } />
                    <Route path="/participant/:participantId" element={<ParticipantDetail />} />
                </Routes>
            </main>
        </div>
      </HashRouter>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <RegisterScreen
          onSwitchToLogin={() => setShowRegister(false)}
          onRegisterSuccess={() => setShowRegister(false)}
        />
      );
    }
    return <LoginScreen onSwitchToRegister={() => setShowRegister(true)} />;
  }

  return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
