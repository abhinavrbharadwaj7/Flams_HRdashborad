import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from './LoginPage';
import Navbar from './Navbar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Analytics from './pages/Analytics';
import Bookmarks from './pages/Bookmarks';

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState(null);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleNavigate = (page, params = null) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'employees':
        return (
          <Employees 
            employeeId={pageParams?.employeeId} 
            onNavigate={handleNavigate} 
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'bookmarks':
        return <Bookmarks onNavigate={handleNavigate}/>;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
};

export default MainApp;