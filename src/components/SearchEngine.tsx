// src/components/SearchEngine.tsx

/*
  This is the recipe search engine component that allows users to find recipes based on the ingredients typed in, cusine type chosen, dietary preference chosen, intolerance selected OR get one random recipe.
 
  Fetches recipe data from Spoonacular API based on user query and return all the recipe results back to the main view of Search recipe page to handle later.
*/


import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Recipe, SearchEngineProps } from '@/types/Recipe';

const SearchEngine: React.FC<SearchEngineProps> = ({ 
  onSearchResults, 
  updateLoadingState 
}) => {
  // State management
  const [searchInput, setSearchInput] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedDiet, setSelectedDiet] = useState<string>('');
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const announcerRef = useRef<HTMLDivElement>(null);

  // Constants for dropdown options
  const cuisines = [
    "African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese",
    "Eastern European", "European", "French", "German", "Greek", "Indian",
    "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American",
    "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "Southern",
    "Spanish", "Thai", "Vietnamese"
  ];

  const diets = [
    "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian",
    "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Low FODMAP"
  ];

  const intolerances = [
    "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame",
    "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
  ];

  // Create or get announcer element for accessibility
  useEffect(() => {
    // Set up keyboard event listener for drawer
    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      if (showDrawer && event.key === 'Escape') {
        setShowDrawer(false);
      }
    };

    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [showDrawer]);

  // Helper function to announce messages to screen readers
  const announceMessage = (message: string) => {
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.id = 'announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }
    announcerRef.current.textContent = message;
  };

  // Function to add ingredient
  const addIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedInput = searchInput.trim();
    if (trimmedInput && !ingredients.includes(trimmedInput)) {
      setIngredients([...ingredients, trimmedInput]);
      announceMessage(`Added ${trimmedInput} to ingredients`);
    }
    setSearchInput('');
  };

  // Function to handle comma-separated inputs
  const addOnComma = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.includes(',')) {
      const terms = value.split(',').map(term => term.trim());
      const newIngredients = [...ingredients];
      let added = false;
      
      terms.forEach(term => {
        if (term && !ingredients.includes(term)) {
          newIngredients.push(term);
          added = true;
        }
      });
      
      if (added) {
        setIngredients(newIngredients);
        setSearchInput('');
        announceMessage(`Added ingredients to list`);
      }
    }
  };

  // Function to remove ingredient
  const removeIngredient = (index: number) => {
    const removedIngredient = ingredients[index];
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    announceMessage(`Removed ${removedIngredient} from ingredients`);
  };

  // Function to search recipes
  const searchRecipes = () => {
    updateLoadingState(true);
    announceMessage('Searching for recipes...');

    const ingredientQuery = ingredients.join(',');
    const cuisineQuery = selectedCuisine;
    const intoleranceQuery = selectedIntolerances.join(',');
    const dietQuery = selectedDiet;
    const maxNumberOutput = 16;

    if (ingredientQuery) {
      axios
        .get('https://api.spoonacular.com/recipes/complexSearch', {
          params: {
            apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
            query: '',
            includeIngredients: ingredientQuery,
            cuisine: cuisineQuery,
            intolerances: intoleranceQuery,
            diet: dietQuery,
            addRecipeInformation: true,
            instructionsRequired: true,
            number: maxNumberOutput,
          },
        })
        .then((response) => {
          const recipes = response.data.results;
          recipes.sort((a: Recipe, b: Recipe) => b.healthScore - a.healthScore);
          
          updateLoadingState(false);
          onSearchResults(recipes, response.data.totalResults, true);
          announceMessage(`Found ${recipes.length} recipes`);
        })
        .catch((error) => {
          console.error(error);
          updateLoadingState(false);
          announceMessage('Error searching recipes. Please try again.');
          showNotification('Error searching recipes. Please try again.');
        });
    } else {
      showNotification('Please enter at least one ingredient.');
      updateLoadingState(false);
    }
  };

  // Function for "I'm Feeling Lucky" feature
  const feelingLucky = () => {
    updateLoadingState(true);
    announceMessage('Finding a random recipe...');

    axios
      .get('https://api.spoonacular.com/recipes/random', {
        params: {
          apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
          number: 1,
        },
      })
      .then((response) => {
        updateLoadingState(false);
        onSearchResults([response.data.recipes[0]], 1, true);
        announceMessage('Random recipe found');
      })
      .catch((error) => {
        console.error(error);
        updateLoadingState(false);
        announceMessage('Error finding random recipe. Please try again.');
        showNotification('Error finding random recipe. Please try again.');
      });
  };

  // Function to apply filters
  const applyFilters = () => {
    setShowDrawer(false);
    
    // Create a summary of applied filters for screen readers
    const filters = [];
    if (selectedCuisine) filters.push(`Cuisine: ${selectedCuisine}`);
    if (selectedDiet) filters.push(`Diet: ${selectedDiet}`);
    if (selectedIntolerances.length) {
      filters.push(`Intolerances: ${selectedIntolerances.join(', ')}`);
    }

    const message = filters.length
      ? `Filters applied: ${filters.join('; ')}`
      : 'All filters cleared';

    announceMessage(message);
  };

  // Function to show notification
  const showNotification = (message: string) => {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className =
      'fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 3000);

    // Announce to screen readers
    announceMessage(message);
  };

  // Function to handle intolerance toggle
  const handleIntoleranceToggle = (value: string) => {
    setSelectedIntolerances(prevState => {
      if (prevState.includes(value)) {
        return prevState.filter(item => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  return (
    <section aria-label="Recipe Search" className="max-w-4xl mx-auto">
      <div className="mb-8">
        <label
          htmlFor="search"
          className="block text-xl font-medium text-gray-700 text-center mb-4"
        >
          Enter Your Ingredients
          <span className="block text-sm text-gray-500 mt-1">
            Press Enter or comma to add multiple ingredients
          </span>
        </label>

        {/* Search Input Group */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="relative flex-grow max-w-2xl">
            <form onSubmit={addIngredient}>
              <input
                type="text"
                id="search"
                className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all shadow-sm hover:border-gray-300"
                value={searchInput}
                onChange={addOnComma}
                placeholder="e.g., apple, broccoli, chicken..."
                aria-label="Ingredient search"
              />
            </form>
            {searchInput && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setSearchInput('')}
                aria-label="Clear search"
              >
                X
              </div>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowDrawer(true)}
            className="flex items-center justify-center gap-2 bg-white border-2 border-purple-600 text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-purple-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            aria-label="Open filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filters
          </button>
        </div>

        {/* Ingredient Tags */}
        <div
          className="flex flex-wrap gap-2 mt-4 justify-center"
          role="list"
          aria-label="Selected ingredients"
        >
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="group bg-purple-100 rounded-full pl-4 pr-2 py-2 flex items-center transition-all hover:bg-purple-200"
              role="listitem"
            >
              <span className="text-purple-700">{ingredient}</span>
              <button
                onClick={() => removeIngredient(index)}
                className="ml-2 p-1 text-purple-400 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full transition-colors"
                aria-label={`Remove ${ingredient}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons: Search Recipe & I'm Feeling Lucky */}
      <div className="flex justify-center space-x-4 mt-4">
        <button 
          className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={searchRecipes} 
          disabled={ingredients.length === 0} 
          title="Search recipes with selected ingredients" 
          style={{ maxWidth: '50%', maxHeight: '10%' }}
        >
          Search Recipes
        </button>
        <button 
          className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 max-w-xs"
          onClick={feelingLucky} 
          title="Get a completely random recipe!" 
          style={{ maxWidth: '50%', maxHeight: '10%' }}
        >
          I'm Feeling Lucky
        </button>
      </div>

      {/* Filter Drawer Backdrop */}
      {showDrawer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity z-40"
          onClick={() => setShowDrawer(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Filter Drawer */}
      {showDrawer && (
        <div
          className="fixed inset-x-0 bottom-0 transform transition-transform z-50 sm:top-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:mx-auto"
          role="dialog"
          aria-label="Recipe filters"
        >
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Filter Recipes</h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Filter Groups */}
            <div className="space-y-6">
              {/* Cuisine & Diet Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="cuisine"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Cuisine Type
                  </label>
                  <select
                    id="cuisine"
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Any Cuisine</option>
                    {cuisines.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="diet"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Dietary Preference
                  </label>
                  <select
                    id="diet"
                    value={selectedDiet}
                    onChange={(e) => setSelectedDiet(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Any Diet</option>
                    {diets.map((diet) => (
                      <option key={diet} value={diet}>
                        {diet}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Intolerances */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Intolerances
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {intolerances.map((intolerance) => (
                    <label
                      key={intolerance}
                      className="flex items-center space-x-3 text-gray-600 hover:text-gray-900"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIntolerances.includes(intolerance)}
                        onChange={() => handleIntoleranceToggle(intolerance)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm">{intolerance}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="mt-8">
              <button
                onClick={applyFilters}
                className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden announcer for accessibility */}
      <div 
        id="announcer" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
    </section>
  );
};

export default SearchEngine;