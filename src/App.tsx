import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TodoList from './pages/TodoList';
import Schedule from './pages/Schedule';
import AuthForm from './components/AuthForm';
import { useStore } from './lib/store';
import { useTheme } from './lib/theme';

function App() {
  const { user, initAuth } = useStore();
  const { isDark } = useTheme();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
          <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-8">
            Sign in to access your productivity dashboard
          </p>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: isDark ? 'hsl(var(--card))' : '#fff',
              color: isDark ? 'hsl(var(--foreground))' : '#000',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;