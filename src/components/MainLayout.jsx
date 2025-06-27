import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = ({ userEmail, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        userEmail={userEmail}
        onLogout={onLogout}
      />
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;