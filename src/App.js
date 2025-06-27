import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainApp from './components/MainApp';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <MainApp />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;