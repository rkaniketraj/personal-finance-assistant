import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Receipts from './pages/Receipts';
import Analysis from './pages/Analysis';
import Profile from './pages/Profile';

// Components
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';

// Utils
import { isAuthenticated, initializeAuth, setUser, shouldFetchProfile } from './utils/auth';
import { authAPI } from './services/api';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication state
    const initAuth = async () => {
      const hasUserData = initializeAuth();
      
      if (hasUserData) {
        // We have user data, assume authenticated
        setIsAuth(true);
        setLoading(false);
      } else {
        // Only try to fetch profile if we're not on a public route
        const currentPath = window.location.pathname;
        const publicRoutes = ['/', '/login', '/register'];
        const isPublicRoute = publicRoutes.includes(currentPath);
        
        if (!isPublicRoute) {
          // Try to get profile to check if we have a valid cookie
          try {
            const response = await authAPI.getProfile();
            if (response.user) {
              setUser(response.user);
              setIsAuth(true);
            }
          } catch {
            // No valid cookie or server error, stay unauthenticated
            setIsAuth(false);
          }
        } else {
          // On public routes, don't make unnecessary API calls
          setIsAuth(false);
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Personal Finance Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/register" element={<Register setIsAuth={setIsAuth} />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute isAuth={isAuth}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute isAuth={isAuth}>
              <Transactions />
            </ProtectedRoute>
          } />
          <Route path="/transactions/new" element={
            <ProtectedRoute isAuth={isAuth}>
              <Transactions />
            </ProtectedRoute>
          } />
          <Route path="/receipts" element={
            <ProtectedRoute isAuth={isAuth}>
              <Receipts />
            </ProtectedRoute>
          } />
          <Route path="/analysis" element={
            <ProtectedRoute isAuth={isAuth}>
              <Analysis />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute isAuth={isAuth}>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Redirect to landing page if route not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;