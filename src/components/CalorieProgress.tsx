
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { CalorieLog } from '@/types';

interface CalorieProgressProps {
  consumed: number;
  goal: number;
  logs?: CalorieLog[];
}

const CalorieProgress: React.FC<CalorieProgressProps> = ({ consumed, goal, logs }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = Math.min((consumed / goal) * 100, 100);
    setProgress(percentage);
  }, [consumed, goal]);

  const getProgressColor = () => {
    if (progress <= 50) return 'bg-green-500';
    if (progress <= 75) return 'bg-amber-500';
    if (progress <= 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Today's Calories</h3>
        <span className="text-sm font-medium">
          {consumed} / {goal} cal
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2"
        indicatorClassName={getProgressColor()}
      />
      
      <div className="text-sm text-gray-500 flex justify-between">
        <span>{Math.max(0, goal - consumed)} calories remaining</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {logs && logs.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Today's Food Log</h3>
          <ul className="space-y-2">
            {logs.map((log) => (
              <li 
                key={log.id} 
                className="flex justify-between items-center text-sm py-2 border-b border-gray-100"
              >
                <span>{log.recipeName}</span>
                <span className="font-medium">{log.calories} cal</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalorieProgress;
