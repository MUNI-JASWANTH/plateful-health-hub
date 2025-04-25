
import { useState } from 'react';
import { Recipe } from '@/types';
import { useCalories } from '@/context/CalorieContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Clock, Users } from 'lucide-react';

interface RecipeDetailsProps {
  recipe: Recipe;
  open: boolean;
  onClose: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe, open, onClose }) => {
  const { addLog } = useCalories();
  const { user } = useAuth();
  const { toast } = useToast();

  const trackCalories = () => {
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
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{recipe.title}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {recipe.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="rounded-md overflow-hidden h-52">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-between items-center py-2 border-y">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm">{recipe.prepTime + recipe.cookTime} mins</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm">{recipe.servings} servings</span>
            </div>
            <div className="font-medium text-sm">
              {recipe.totalCalories} calories
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Ingredients</h3>
            <ul className="space-y-1">
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="text-sm flex justify-between">
                  <span>
                    {ingredient.name} ({ingredient.quantity})
                  </span>
                  <span className="text-gray-500">{ingredient.calories} cal</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Instructions</h3>
            <ol className="space-y-2 list-decimal ml-5">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="text-sm">{step}</li>
              ))}
            </ol>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={trackCalories}>I ate this</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetails;
