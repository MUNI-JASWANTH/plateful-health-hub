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
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash) {
      setShowSplash(false);
      setIsInitialized(true);
    } else {
      setShowSplash(true);
      localStorage.setItem("hasSeenSplash", "true");
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
                {showSplash ? (
                  <SplashScreen onComplete={handleSplashComplete} />
                ) : (
                  <div className="min-h-screen bg-gray-50">
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      
                      <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/cookbook" element={<Cookbook />} />
                        <Route path="/calories" element={<Calories />} />
                        <Route path="/profile" element={<Profile />} />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <BottomTabs />
                  </div>
                )}
              </TooltipProvider>
            </CalorieProvider>
          </RecipeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
