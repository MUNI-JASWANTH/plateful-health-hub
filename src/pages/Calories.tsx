
import { useState } from 'react';
import { useCalories } from '@/context/CalorieContext';
import { useAuth } from '@/context/AuthContext';
import CalorieProgress from '@/components/CalorieProgress';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Calories = () => {
  const { getDailyCalories, getDailyLogs, dailyGoal, setDailyGoal } = useCalories();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const dailyCalories = getDailyCalories(selectedDate);
  const dailyLogs = getDailyLogs(selectedDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleGoalSubmit = () => {
    const newGoal = parseInt(goalInput);
    if (isNaN(newGoal) || newGoal <= 0) {
      toast({
        title: "Invalid Goal",
        description: "Please enter a positive number for your calorie goal",
        variant: "destructive"
      });
      return;
    }
    
    setDailyGoal(newGoal);
    setIsEditing(false);
    toast({
      title: "Goal Updated",
      description: `Your daily calorie goal is now ${newGoal} calories`,
    });
  };

  if (!user) {
    return (
      <div className="pb-16">
        <div className="gradient-green py-8 px-4 text-white">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-1">Calorie Tracker</h1>
            <p className="text-white/80">Monitor your daily calorie intake</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold mb-3">Sign in to track your calories</h2>
          <p className="text-gray-500 mb-6">Keep track of your nutrition goals</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/login')}>Sign In</Button>
            <Button onClick={() => navigate('/signup')} variant="outline">Create Account</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="gradient-green py-8 px-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-1">Calorie Tracker</h1>
          <p className="text-white/80">Monitor your daily calorie intake</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Date Selection */}
        <div className="flex items-center mb-6 bg-white p-3 rounded-lg shadow-sm">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
        </div>
        
        {/* Calorie Goal Setting */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-medium mb-3">Daily Calorie Goal</h3>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleGoalSubmit}>Save</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setGoalInput(dailyGoal.toString());
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">{dailyGoal} calories</div>
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Goal</Button>
            </div>
          )}
        </div>
        
        {/* Calorie Progress */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <CalorieProgress 
            consumed={dailyCalories} 
            goal={dailyGoal} 
            logs={dailyLogs}
          />
        </div>
      </div>
    </div>
  );
};

export default Calories;
