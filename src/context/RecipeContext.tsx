
import React, { createContext, useContext, useState } from 'react';
import { Recipe, Ingredient } from '@/types';

// Sample data
const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Avocado Toast with Poached Eggs',
    description: 'A delicious and healthy breakfast option packed with healthy fats and protein.',
    ingredients: [
      { name: 'Whole grain bread', quantity: '2 slices', calories: 80 },
      { name: 'Ripe avocado', quantity: '1', calories: 234 },
      { name: 'Eggs', quantity: '2', calories: 144 },
      { name: 'Cherry tomatoes', quantity: '1/4 cup', calories: 20 },
      { name: 'Salt', quantity: 'to taste', calories: 0 },
      { name: 'Black pepper', quantity: 'to taste', calories: 0 },
      { name: 'Red pepper flakes', quantity: 'a pinch', calories: 0 }
    ],
    steps: [
      'Toast the bread until golden and crispy.',
      'Slice the avocado and spread it on the toast.',
      'In a small pot, bring water to a gentle simmer and add a splash of vinegar.',
      'Crack each egg into a small bowl, then gently slide into the simmering water.',
      'Cook for 3-4 minutes until the whites are set but yolks are still runny.',
      'Using a slotted spoon, remove eggs and place on top of the avocado toast.',
      'Top with halved cherry tomatoes, salt, black pepper, and red pepper flakes.'
    ],
    totalCalories: 478,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    createdBy: 'admin'
  },
  {
    id: '2',
    title: 'Greek Yogurt Berry Parfait',
    description: 'A simple, nutritious breakfast or snack layered with protein-rich yogurt.',
    ingredients: [
      { name: 'Greek yogurt', quantity: '1 cup', calories: 130 },
      { name: 'Mixed berries', quantity: '1 cup', calories: 85 },
      { name: 'Granola', quantity: '1/4 cup', calories: 120 },
      { name: 'Honey', quantity: '1 tablespoon', calories: 64 }
    ],
    steps: [
      'In a glass or bowl, add a layer of Greek yogurt.',
      'Add a layer of mixed berries.',
      'Sprinkle some granola on top.',
      'Repeat the layers until ingredients are used up.',
      'Drizzle honey on top before serving.'
    ],
    totalCalories: 399,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    createdBy: 'admin'
  },
  {
    id: '3',
    title: 'Quinoa Buddha Bowl',
    description: 'A nutritionally balanced bowl with whole grains, vegetables, and lean protein.',
    ingredients: [
      { name: 'Cooked quinoa', quantity: '1 cup', calories: 222 },
      { name: 'Roasted sweet potatoes', quantity: '1 cup', calories: 114 },
      { name: 'Chickpeas', quantity: '1/2 cup', calories: 120 },
      { name: 'Avocado', quantity: '1/2', calories: 117 },
      { name: 'Baby spinach', quantity: '1 cup', calories: 7 },
      { name: 'Cherry tomatoes', quantity: '1/2 cup', calories: 13 },
      { name: 'Tahini dressing', quantity: '2 tablespoons', calories: 85 }
    ],
    steps: [
      'Add cooked quinoa to the base of your bowl.',
      'Arrange roasted sweet potatoes, chickpeas, sliced avocado, baby spinach, and halved cherry tomatoes on top.',
      'Drizzle with tahini dressing before serving.'
    ],
    totalCalories: 678,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 30,
    servings: 1,
    createdBy: 'admin'
  }
];

interface RecipeContextType {
  recipes: Recipe[];
  savedRecipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  saveRecipe: (id: string) => void;
  unsaveRecipe: (id: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const addRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    const newRecipe = {
      ...recipeData,
      id: Date.now().toString(),
    };
    setRecipes([...recipes, newRecipe]);
  };

  const updateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    ));
    
    // Also update in savedRecipes if it exists there
    if (savedRecipes.some(recipe => recipe.id === updatedRecipe.id)) {
      setSavedRecipes(savedRecipes.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      ));
    }
  };

  const deleteRecipe = (id: string) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
    setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
  };

  const saveRecipe = (id: string) => {
    const recipeToSave = recipes.find(recipe => recipe.id === id);
    if (recipeToSave && !savedRecipes.some(recipe => recipe.id === id)) {
      setSavedRecipes([...savedRecipes, {...recipeToSave, isSaved: true}]);
    }
  };

  const unsaveRecipe = (id: string) => {
    setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      savedRecipes,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      saveRecipe,
      unsaveRecipe
    }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
