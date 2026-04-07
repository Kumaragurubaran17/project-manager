import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ProjectsDashboard from './pages/ProjectsDashboard';
import ProjectDetail from './pages/ProjectDetail';
import Auth from './pages/Auth';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
          <div className="w-12 h-12 rounded-2xl bg-primary animate-pulse shadow-lg flex items-center justify-center">
             <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse font-sans">Initializing Zenith</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!session ? (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        ) : (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsDashboard />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="teams" element={<div className="p-8 font-bold text-slate-400">Teams Section (Work in Progress)</div>} />
            <Route path="settings" element={<div className="p-8 font-bold text-slate-400">Settings Section (Work in Progress)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
