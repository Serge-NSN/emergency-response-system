import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import EmergencyReportPage from './pages/EmergencyReportPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

const PrivateRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emergency-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <AppLayout>
                    <HomePage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/report" element={
                <PrivateRoute>
                  <AppLayout>
                    <EmergencyReportPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/map" element={
                <PrivateRoute>
                  <AppLayout>
                    <MapPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/dashboard" element={
                <PrivateRoute roles={['responder', 'admin']}>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/analytics" element={
                <PrivateRoute roles={['admin']}>
                  <AppLayout>
                    <AnalyticsPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
