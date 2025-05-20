// TypeScript type definitions for Recipe Finder

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  servings: number;
  readyInMinutes: number;
  license?: string;
  sourceName?: string;
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  healthScore: number;
  spoonacularScore?: number;
  pricePerServing?: number;
  analyzedInstructions?: any[];
  cheap?: boolean;
  creditsText?: string;
  cuisines?: string[];
  dairyFree?: boolean;
  diets?: string[];
  gaps?: string;
  glutenFree?: boolean;
  instructions?: string;
  ketogenic?: boolean;
  lowFodmap?: boolean;
  occasions?: string[];
  sustainable?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  veryHealthy?: boolean;
  veryPopular?: boolean;
  whole30?: boolean;
  weightWatcherSmartPoints?: number;
  dishTypes?: string[];
  extendedIngredients?: Ingredient[];
  summary?: string;
  winePairing?: any;
  usedIngredients?: Ingredient[];
  missedIngredients?: Ingredient[];
  unusedIngredients?: Ingredient[];
  likes?: number;
}

export interface Ingredient {
  id: number;
  aisle?: string;
  image?: string;
  consistency?: string;
  name: string;
  nameClean?: string;
  original?: string;
  originalName?: string;
  amount?: number;
  unit?: string;
  meta?: string[];
  measures?: {
    us?: {
      amount?: number;
      unitShort?: string;
      unitLong?: string;
    };
    metric?: {
      amount?: number;
      unitShort?: string;
      unitLong?: string;
    };
  };
}

export interface SearchEngineProps {
  onSearchResults: (recipes: Recipe[], totalResults: number, searchTriggered: boolean) => void;
  updateLoadingState: (isLoading: boolean) => void;
}

// For accessibility features
export interface AnnouncerMessages {
  addedIngredient: string;
  removedIngredient: string;
  searchingRecipes: string;
  recipesFound: string;
  errorSearching: string;
  findingRandom: string;
  randomFound: string;
  errorRandom: string;
  filtersApplied: string;
}