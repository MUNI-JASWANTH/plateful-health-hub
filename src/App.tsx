import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import { CalorieProvider } from './context/CalorieContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Index from './pages/Index';
import SplashScreen from './components/SplashScreen';

// Use lazy loading for routes to improve initial load time
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const Calories = lazy(() => import('./pages/Calories'));
const Cookbook = lazy(() => import('./pages/Cookbook'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <RecipeProvider>
          <CalorieProvider>
            <Suspense fallback={<SplashScreen />}>
              <Routes>
                <Route path="/" element={<Index />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  
                  <Route element={<PrivateRoute />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="calories" element={<Calories />} />
                    <Route path="cookbook" element={<Cookbook />} />
                  </Route>
                  
                  <Route element={<AdminRoute />}>
                    {/* Admin routes go here */}
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
            <Toaster position="top-center" />
          </CalorieProvider>
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
