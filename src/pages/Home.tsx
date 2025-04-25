
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '@/context/RecipeContext';
import { useCalories } from '@/context/CalorieContext';
import { useAuth } from '@/context/AuthContext';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetails from '@/components/RecipeDetails';
import CalorieProgress from '@/components/CalorieProgress';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Home = () => {
  const { recipes } = useRecipes();
  const { getDailyCalories, getDailyLogs, dailyGoal } = useCalories();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      setShowLoginPrompt(false);
    }
    
    // Filter recipes based on search term
    if (searchTerm) {
      setFilteredRecipes(
        recipes.filter(recipe => 
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchTerm, recipes, user]);

  const dailyCalories = getDailyCalories();
  const dailyLogs = getDailyLogs();
  
  const handleRecipeClick = (recipeId: string) => {
    setSelectedRecipe(recipeId);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);

  return (
    <div className="pb-16 mb-2">
      {/* Header Section */}
      <div className="gradient-green py-8 px-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-1">Welcome to Plateful</h1>
          <p className="text-white/80">Discover delicious and healthy recipes</p>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-5 mb-6">
        <div className="bg-white rounded-xl shadow-md p-3 flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <Input
            type="text"
            placeholder="Search recipes, ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm"
          />
        </div>
      </div>
      
      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="container mx-auto px-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 animate-fade-in">
            <h3 className="font-medium">Track your health journey</h3>
            <p className="text-sm text-gray-600">Sign in to save recipes and track your calories</p>
            <div className="flex gap-2 mt-1">
              <Button onClick={() => navigate('/login')} variant="default">Sign In</Button>
              <Button onClick={() => navigate('/signup')} variant="outline">Create Account</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Calorie Tracker (only if logged in) */}
      {user && (
        <div className="container mx-auto px-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <CalorieProgress 
              consumed={dailyCalories} 
              goal={dailyGoal} 
            />
            <div className="mt-2 text-center">
              <Button 
                onClick={() => navigate('/calories')} 
                variant="link" 
                className="text-plateful-primary"
              >
                View detailed calories
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Recipes Section */}
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-xl mb-4">Featured Recipes</h2>
        
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No recipes found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRecipes.map(recipe => (
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

export default Home;
