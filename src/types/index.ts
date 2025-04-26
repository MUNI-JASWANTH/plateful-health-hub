
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  avatarUrl?: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  totalCalories: number;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  createdBy: string;
  isSaved?: boolean;
}

export interface Ingredient {
  name: string;
  quantity: string;
  calories: number;
}

export interface CalorieLog {
  id: string;
  userId: string;
  recipeId: string;
  recipeName: string;
  calories: number;
  date: string;
}
