
import { useState } from 'react';
import { Recipe } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useRecipes } from '@/context/RecipeContext';
import { useCalories } from '@/context/CalorieContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const { saveRecipe, unsaveRecipe } = useRecipes();
  const { addLog } = useCalories();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save recipes",
        variant: "destructive"
      });
      return;
    }
    
    if (isSaved) {
      unsaveRecipe(recipe.id);
      setIsSaved(false);
      toast({
        title: "Recipe removed",
        description: "Recipe removed from your cookbook"
      });
    } else {
      saveRecipe(recipe.id);
      setIsSaved(true);
      toast({
        title: "Recipe saved",
        description: "Recipe added to your cookbook"
      });
    }
  };

  const trackCalories = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track calories",
        variant: "destructive"
      });
      return;
    }

    addLog({
      userId: user.id,
      recipeId: recipe.id,
      recipeName: recipe.title,
      calories: recipe.totalCalories
    });

    toast({
      title: "Calories tracked!",
      description: `Added ${recipe.totalCalories} calories to your daily log`,
    });
  };

  return (
    <Card 
      className="recipe-card cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <button
          onClick={toggleSave}
          className="absolute top-2 right-2 p-2 bg-white/70 backdrop-blur-sm rounded-full"
        >
          <Heart 
            className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
          />
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{recipe.title}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{recipe.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">{recipe.totalCalories}</span> calories
          </div>
          <Button 
            onClick={trackCalories}
            variant="outline" 
            size="sm"
            className="text-xs py-1 h-auto"
          >
            I ate this
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
