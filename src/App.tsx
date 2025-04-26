
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RecipeProvider } from "@/context/RecipeContext";
import { CalorieProvider } from "@/context/CalorieContext";
import PrivateRoute from "@/components/PrivateRoute";
import AdminRoute from "@/components/AdminRoute";
import BottomTabs from "@/components/BottomTabs";

import SplashScreen from "@/components/SplashScreen";
import Home from "@/pages/Home";
import Cookbook from "@/pages/Cookbook";
import Calories from "@/pages/Calories";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if it's the first visit or if it's been more than a day since the last visit
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");
    const lastVisit = localStorage.getItem("lastVisit");
    const now = new Date().getTime();
    
    // Show splash if it's the first visit or it's been more than a day
    const shouldShowSplash = !hasSeenSplash || 
      (lastVisit && (now - parseInt(lastVisit)) > 24 * 60 * 60 * 1000);
    
    if (!shouldShowSplash) {
      setShowSplash(false);
      setIsInitialized(true);
    } else {
      setShowSplash(true);
      // Store the current time as the last visit
      localStorage.setItem("hasSeenSplash", "true");
      localStorage.setItem("lastVisit", now.toString());
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setIsInitialized(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <RecipeProvider>
            <CalorieProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    
                    <Route path="/" element={<Home />} />
                    
                    <Route element={<PrivateRoute />}>
                      <Route path="/cookbook" element={<Cookbook />} />
                      <Route path="/calories" element={<Calories />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BottomTabs />
                </div>
              </TooltipProvider>
            </CalorieProvider>
          </RecipeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
