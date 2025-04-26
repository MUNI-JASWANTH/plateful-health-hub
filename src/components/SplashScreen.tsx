
import { useEffect, useState } from 'react';
import LogoIcon from '@/assets/logo';
import { motion } from 'framer-motion';
import { Utensils, Apple, HeartPulse } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    // Show icons after initial animation
    const iconTimer = setTimeout(() => {
      setShowIcons(true);
    }, 1000);

    // Complete splash screen after animation
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(iconTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-amber-50 flex flex-col items-center justify-center z-50 overflow-hidden">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="flex flex-col items-center"
      >
        <LogoIcon className="w-32 h-32 mb-4" />
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-5xl font-bold text-plateful-primary"
        >
          Plateful
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-lg text-plateful-dark mt-2 text-center max-w-xs px-4"
        >
          Your journey to healthier eating starts here
        </motion.p>
      </motion.div>
      
      {showIcons && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex space-x-10 mt-10"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Utensils className="w-8 h-8 text-plateful-accent" />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Apple className="w-8 h-8 text-plateful-primary" />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <HeartPulse className="w-8 h-8 text-plateful-accent" />
          </motion.div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="w-64 h-1 bg-gradient-to-r from-plateful-accent via-plateful-primary to-plateful-secondary mt-12 origin-left rounded-full"
      />
    </div>
  );
};

export default SplashScreen;
