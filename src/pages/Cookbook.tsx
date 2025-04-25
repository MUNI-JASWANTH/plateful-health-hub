
import { useState } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import { useAuth } from '@/context/AuthContext';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetails from '@/components/RecipeDetails';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Cookbook = () => {
  const { recipes, savedRecipes } = useRecipes();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'saved'>('all');

  const handleRecipeClick = (recipeId: string) => {
    setSelectedRecipe(recipeId);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  const displayedRecipes = filterType === 'all' ? recipes : savedRecipes;
  const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);

  if (!user) {
    return (
      <div className="pb-16">
        <div className="gradient-green py-8 px-4 text-white">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-1">My Cookbook</h1>
            <p className="text-white/80">Save and organize your favorite recipes</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold mb-3">Sign in to access your cookbook</h2>
          <p className="text-gray-500 mb-6">Save your favorite recipes and track your calories</p>
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
          <h1 className="text-2xl font-bold mb-1">My Cookbook</h1>
          <p className="text-white/80">Save and organize your favorite recipes</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <Button
            variant={filterType === 'all' ? "default" : "outline"}
            onClick={() => setFilterType('all')}
            className="whitespace-nowrap"
          >
            All Recipes
          </Button>
          <Button
            variant={filterType === 'saved' ? "default" : "outline"}
            onClick={() => setFilterType('saved')}
            className="whitespace-nowrap"
          >
            Saved Recipes
          </Button>
        </div>
        
        {filterType === 'saved' && savedRecipes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You haven't saved any recipes yet</p>
            <Button onClick={() => setFilterType('all')}>Browse All Recipes</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onClick={() => handleRecipeClick(recipe.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Recipe Details Modal */}
      {selectedRecipeData && (
        <RecipeDetails 
          recipe={selectedRecipeData}
          open={!!selectedRecipe}
          onClose={closeRecipeDetails}
        />
      )}
    </div>
  );
};

export default Cookbook;
