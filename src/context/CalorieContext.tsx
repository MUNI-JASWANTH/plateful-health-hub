
import React, { createContext, useContext, useState } from 'react';
import { CalorieLog } from '@/types';

interface CalorieContextType {
  logs: CalorieLog[];
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  addLog: (log: Omit<CalorieLog, 'id' | 'date'>) => void;
  removeLog: (id: string) => void;
  getDailyCalories: (date?: string) => number;
  getDailyLogs: (date?: string) => CalorieLog[];
}

const CalorieContext = createContext<CalorieContextType | undefined>(undefined);

export const CalorieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<CalorieLog[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number>(2000);

  const addLog = (logData: Omit<CalorieLog, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog = {
      ...logData,
      id: Date.now().toString(),
      date: today
    };
    setLogs([...logs, newLog]);
  };

  const removeLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const getDailyCalories = (date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return logs
      .filter(log => log.date === targetDate)
      .reduce((sum, log) => sum + log.calories, 0);
  };

  const getDailyLogs = (date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return logs.filter(log => log.date === targetDate);
  };

  return (
    <CalorieContext.Provider value={{
      logs,
      dailyGoal,
      setDailyGoal,
      addLog,
      removeLog,
      getDailyCalories,
      getDailyLogs
    }}>
      {children}
    </CalorieContext.Provider>
  );
};

export const useCalories = () => {
  const context = useContext(CalorieContext);
  if (context === undefined) {
    throw new Error('useCalories must be used within a CalorieProvider');
  }
  return context;
};
