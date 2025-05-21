// src/app/recipe/page.tsx

/*
  Recipe detail page displaying complete information about a recipe including basic information, ingredients, instructions, and nutrition facts.
  
  Fetches recipe data from Spoonacular API and nutrition data from Edamam API (API keys are located in the 
  .env.local file ).

  Shows loading screen with food trivia while data is being fetched.
*/

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import { Recipe } from '@/types/Recipe';

const RecipeDetailPage = () => {

  const params = useParams();
  const searchParams = useSearchParams();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeNutrition, setRecipeNutrition] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trivia, setTrivia] = useState<string | null>(null);

  // Calculated values for nutrition chart
  const carbCalories = recipeNutrition?.totalNutrients?.CHOCDF?.quantity * 4 || 0;
  const proteinCalories = recipeNutrition?.totalNutrients?.PROCNT?.quantity * 4 || 0;
  const fatCalories = recipeNutrition?.totalNutrients?.FAT?.quantity * 9 || 0;
  const totalMacroCalories = carbCalories + proteinCalories + fatCalories;
  
  const carbPercentage = totalMacroCalories ? (carbCalories / totalMacroCalories) * 100 : 0;
  const proteinPercentage = totalMacroCalories ? (proteinCalories / totalMacroCalories) * 100 : 0;
  const fatPercentage = totalMacroCalories ? (fatCalories / totalMacroCalories) * 100 : 0;

  const fetchTrivia = async () => {
    try {
      const response = await axios.get('https://api.spoonacular.com/food/trivia/random', {
        params: { apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY }
      });
      setTrivia(response.data.text);
    } catch (error) {
      console.error('Error fetching trivia:', error);
      setTrivia('Oops! Something went wrong fetching the trivia.');
    }
  };

  const fetchNutritionAnalysis = (recipe: Recipe) => {
    if (!recipe.extendedIngredients || recipe.extendedIngredients.length === 0) return;

    const ingredientsInArr = recipe.extendedIngredients.map(ingredient => {
      const amt = ingredient.amount.toString();
      const unit = ingredient.unit ? ingredient.unit + " " : "";
      const ingrName = ingredient.name;
      return `${amt} ${unit}of ${ingrName}`.trim();
    });

    axios.post('https://api.edamam.com/api/nutrition-details', {
      title: recipe.title,
      ingr: ingredientsInArr,
    }, {
      params: {
        app_id: process.env.NEXT_PUBLIC_EDAMAM_API_ID,
        app_key: process.env.NEXT_PUBLIC_EDAMAM_API_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      setRecipeNutrition(response.data);
    })
    .catch(error => {
      console.error('Error fetching nutrition:', error);
    });
  };

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        await fetchTrivia();
        
        // First try to get the recipe from the query parameter
        const recipeData = searchParams.get('data');
        
        if (recipeData) {
          // If recipe data was passed in query params
          const parsedRecipe = JSON.parse(recipeData);
          setRecipe(parsedRecipe);
          fetchNutritionAnalysis(parsedRecipe);
        } else {
          const recipeId = params.id;
          
          // When using axios, we need to await the response and use .data instead of .json()
          const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
            params: { apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY }
          });
          
          setRecipe(response.data);
          fetchNutritionAnalysis(response.data);
        }

        // Simulate loading delay for trivia display
        await new Promise(resolve => setTimeout(resolve, 4000));
      } catch (err) {
        console.error('Error loading recipe:', err);
        setError('Failed to load recipe details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [params.id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
        <h2 className="text-5xl font-bold text-purple-800 my-4 animate-bounce">Did You Know?</h2>
        {trivia ? (
          <p className="text-center text-purple-600 text-lg font-medium max-w-lg mx-4 p-4 bg-white rounded-lg shadow-lg" style={{ maxWidth: '50%' }}>
            {trivia}
          </p>
        ) : (
          <p className="text-gray-500 my-4 text-lg font-medium">Fetching a fun food trivia...</p>
        )}
        <div className="mt-4 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || 'Recipe not found'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      
      <div className="container mx-auto p-8 bg-white shadow-xl rounded-lg" 
        style={{
          backgroundImage: 'url("/background_image/recipe_background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
        <div className="bg-white bg-opacity-85 rounded-lg p-5 content-overlay">

          {/* Title */}
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mr-4 border-b-2 border-purple-600 pb-2">{recipe.title}</h1>
          </div>

          {/* Row 1: Image & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Column 1: Recipe Image */}
              <div className="flex justify-center">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt="recipe.title"
                    className="w-full h-auto max-w-sm rounded-lg shadow-lg border-2 border-purple-200 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 max-w-sm rounded-lg shadow-lg border-2 border-purple-200 bg-gray-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-20 w-20 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

            {/* Column 2: Short Description and Icons */}
            <div className="p-6 bg-purple-50 rounded-lg shadow-md space-y-6">
              {/* Serving Size */}
              <div className="text-lg font-semibold text-gray-700">
                <span>Serving Size:</span> <span>{recipe.servings}</span>
              </div>
              
              {/* Preparation Time */}
              {recipe.preparationMinutes && (
                <div className="text-lg font-semibold text-gray-700">
                  <span>Preparation Time:</span> <span>{recipe.preparationMinutes} min</span>
                </div>
              )}
              
              {/* Health Score */}
              <div className="text-lg font-semibold text-gray-700">
                <span>Health Score:</span> <span>{recipe.healthScore}</span>
              </div>
              
              {/* Meal types */}
              <div className="text-lg font-semibold text-gray-700">
                <span>Dish Type:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipe.dishTypes?.map((dishType, index) => (
                    <span key={index} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {dishType}
                    </span>
                  ))}
                </div>
              </div>

              {/* Icons for vegan, popularity, etc. */}
              <div className="flex space-x-4">
                {/* Vegan icon for vegan recipes */}
                {recipe.vegan && (
                  <div className="flex items-center space-x-2 relative group">
                    <Image src="/icon/vegan.png" alt="Vegan Icon" width={32} height={32} />
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      100% Vegan!
                    </div>
                  </div>
                )}

                {/* Popular icon for very popular recipes */}
                {recipe.veryPopular && (
                  <div className="flex items-center space-x-2 relative group">
                    <Image src="/icon/popular.png" alt="Popular Icon" width={32} height={32} />
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      Very popular!
                    </div>
                  </div>
                )}

                {/* Cheap icon for cheap recipes */}
                {recipe.cheap && (
                  <div className="flex items-center space-x-2 relative group">
                    <Image src="/icon/cheap.png" alt="Cheap Icon" width={32} height={32} />
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-yellow-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      Very cheap!
                    </div>
                  </div>
                )}

                {/* Healthy icon for healthy recipes */}
                {recipe.veryHealthy && (
                  <div className="flex items-center space-x-2 relative group">
                    <Image src="/icon/healthy.png" alt="Healthy Icon" width={32} height={32} />
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      Healthy Choice!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Instructions, Ingredients, and Nutrition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            {/* Column 1: Instructions Section */}
            <div className="p-6 bg-purple-50 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">Instructions</h2>
              <ul className="space-y-4">
                {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                  recipe.analyzedInstructions[0].steps.map((step) => (
                    <li key={step.number} className="p-4 bg-white rounded-lg shadow text-gray-700">
                      <p className="font-semibold">Step {step.number}:</p>
                      <p>{step.step}</p>
                      
                      {/* Ingredients used in each step */}
                      {step.ingredients && step.ingredients.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800">Ingredients:</h4>
                          <ul className="list-disc pl-6 text-gray-700">
                            {step.ingredients.map((ingredient, idx) => (
                              <li key={`${step.number}-ingredient-${idx}`}>{ingredient.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Equipment used in each step */}
                      {step.equipment && step.equipment.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800">Equipment:</h4>
                          <div className="flex flex-wrap mt-2 gap-4">
                            {step.equipment.map((equipment, idx) => (
                              <div key={`${step.number}-equipment-${idx}`} className="flex items-center my-2">
                                {equipment.image && (
                                  <img
                                    src={`${equipment.image}`} 
                                    alt={equipment.name} 
                                    className="w-12 h-12 rounded-full mr-2"
                                  />
                                )}
                                <p className="text-gray-700">
                                  {equipment.name.charAt(0).toUpperCase() + equipment.name.slice(1)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                ) : recipe.instructions ? (
                  <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                ) : (
                  <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                    <p className="font-medium">No detailed instructions available for this recipe.</p>
                    <p className="mt-2">Please check the source website for complete instructions.</p>
                    {recipe.sourceUrl && (
                      <a 
                        href={recipe.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block mt-3 text-purple-600 hover:underline font-medium"
                      >
                        Visit Original Recipe
                      </a>
                    )}
                  </div>
                )}
              </ul>
            </div>

            {/* Column 2: Ingredients & Nutrition Information */}
            <div className="space-y-8">
              {/* Ingredients Used */}
              <div className="p-6 bg-purple-50 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-600">Ingredients Used</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {recipe.extendedIngredients?.map((ingredient, index) => (
                    <li key={`ingredient-${index}`}>
                      {ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)} - {ingredient.amount.toFixed(1)} {ingredient.unit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nutrition Information */}
              {recipeNutrition ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
                  {/* Title */}
                  <h2 className="text-2xl font-bold mb-4 text-purple-600">Nutrition Label</h2>

                  {/* Amount Per Serving */}
                  <p className="text-lg font-bold mb-2">Amount Per Serving</p>

                  {/* Calories per Serving */}
                  <p className="flex justify-between text-lg font-semibold border-b pb-2 mb-2">
                    <span>Calories</span>
                    <span>{(recipeNutrition.calories / recipe.servings).toFixed(0)}</span>
                  </p>

                  {/* % Daily Value* Header */}
                  <p className="text-sm text-gray-800 mb-2 font-bold text-right">% Daily Value*</p>

                  {/* Total Fat */}
                  <div className="flex justify-between text-sm py-1 border-t">
                    <div className="flex">
                      <span className="font-bold">Total Fat</span>
                      <span className="ml-1">{(recipeNutrition.totalNutrients.FAT.quantity / recipe.servings).toFixed(1)}g</span>
                    </div>
                    <span className="font-bold">{(recipeNutrition.totalDaily.FAT.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Saturated Fat */}
                  <div className="flex justify-between text-sm py-1 ml-5">
                    <span>Saturated Fat {(recipeNutrition.totalNutrients.FASAT.quantity / recipe.servings).toFixed(1)}g</span>
                    <span>{(recipeNutrition.totalDaily.FASAT.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Trans Fat (No Daily Value) */}
                  <div className="flex justify-between text-sm py-1 ml-5">
                    <span>Trans Fat {(recipeNutrition.totalNutrients.FATRN.quantity / recipe.servings).toFixed(1)}g</span>
                    <span></span>
                  </div>

                  {/* Cholesterol */}
                  <div className="flex justify-between text-sm py-1 border-t">
                    <div className="flex">
                      <span className="font-bold">Cholesterol</span>
                      <span className="ml-1">{(recipeNutrition.totalNutrients.CHOLE.quantity / recipe.servings).toFixed(1)}mg</span>
                    </div>
                    <span className="font-bold">{(recipeNutrition.totalDaily.CHOLE.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Sodium */}
                  <div className="flex justify-between text-sm py-1 border-t">
                    <div className="flex">
                      <span className="font-bold">Sodium</span>
                      <span className="ml-1">{(recipeNutrition.totalNutrients.NA.quantity / recipe.servings).toFixed(1)}mg</span>
                    </div>
                    <span className="font-bold">{(recipeNutrition.totalDaily.NA.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Total Carbohydrate */}
                  <div className="flex justify-between text-sm py-1 border-t">
                    <div className="flex">
                      <span className="font-bold">Total Carbohydrate</span>
                      <span className="ml-1"> {(recipeNutrition.totalNutrients.CHOCDF.quantity / recipe.servings).toFixed(1)}g</span>
                    </div>
                    <span className="font-bold">{(recipeNutrition.totalDaily.CHOCDF.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Dietary Fiber */}
                  <div className="flex justify-between text-sm py-1 ml-5">
                    <span>Dietary Fiber {(recipeNutrition.totalNutrients.FIBTG.quantity / recipe.servings).toFixed(1)}g</span>
                    <span>{(recipeNutrition.totalDaily.FIBTG.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Total Sugars */}
                  <div className="flex justify-between text-sm py-1 ml-5">
                    <span>Total Sugars {(recipeNutrition.totalNutrients.SUGAR.quantity / recipe.servings).toFixed(1)}g</span>
                    <span></span>
                  </div>

                  {/* Protein */}
                  <div className="flex justify-between text-sm py-1 border-t">
                    <div className="flex">
                      <span className="font-bold">Protein</span>
                      <span className="ml-1">{(recipeNutrition.totalNutrients.PROCNT.quantity / recipe.servings).toFixed(1)}g</span>
                    </div>
                    <span className="font-bold">{(recipeNutrition.totalDaily.PROCNT.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Vitamin D */}
                  <div className="flex justify-between text-sm py-1 border-t">
                    <span>Vitamin D {(recipeNutrition.totalNutrients.VITD.quantity / recipe.servings).toFixed(1)}µg</span>
                    <span>{(recipeNutrition.totalDaily.VITD.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Calcium */}
                  <div className="flex justify-between text-sm py-1 border-t">
                    <span>Calcium {(recipeNutrition.totalNutrients.CA.quantity / recipe.servings).toFixed(1)}mg</span>
                    <span>{(recipeNutrition.totalDaily.CA.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Iron */}
                  <div className="flex justify-between text-sm py-1 border-t">
                    <span>Iron {(recipeNutrition.totalNutrients.FE.quantity / recipe.servings).toFixed(1)}mg</span>
                    <span>{(recipeNutrition.totalDaily.FE.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* Potassium */}
                  <div className="flex justify-between text-sm py-1 border-b border-t">
                    <span>Potassium {(recipeNutrition.totalNutrients.K.quantity / recipe.servings).toFixed(1)}mg</span>
                    <span>{(recipeNutrition.totalDaily.K.quantity / recipe.servings).toFixed(1)}%</span>
                  </div>

                  {/* note */}
                  <div className="flex justify-between text-sm py-1">
                    *The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                  </div>

                  {/* Visual Representation of 3 main nutritions*/}
                  <p className="text-lg font-bold mb-4 mt-4">Macronutrient Breakdown</p>
                  <div className="relative h-8 w-full bg-gray-200 rounded-full overflow-hidden">
                    {/* Carbohydrates */}
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-500 text-white text-sm flex items-center justify-center"
                      style={{ width: `${carbPercentage}%` }}
                    >
                      {carbPercentage.toFixed(0)}%
                    </div>

                    {/* Protein */}
                    <div
                      className="absolute top-0 h-full bg-green-500 text-white text-sm flex items-center justify-center"
                      style={{ width: `${proteinPercentage}%`, left: `${carbPercentage}%` }}
                    >
                      {proteinPercentage.toFixed(0)}%
                    </div>

                    {/* Fat */}
                    <div
                      className="absolute top-0 h-full bg-yellow-500 text-white text-sm flex items-center justify-center"
                      style={{ width: `${fatPercentage}%`, left: `${carbPercentage + proteinPercentage}%` }}
                    >
                      {fatPercentage.toFixed(0)}%
                    </div>
                  </div>

                  {/* Legend for Macronutrient Colors */}
                  <div className="flex justify-around text-sm mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="h-4 w-4 bg-blue-500 inline-block rounded"></span>
                      <span>Carbohydrate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="h-4 w-4 bg-green-500 inline-block rounded"></span>
                      <span>Protein</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="h-4 w-4 bg-yellow-500 inline-block rounded"></span>
                      <span>Fat</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-2xl font-bold mb-4 text-purple-600 text-center">
                    Unfortunately, the Nutrition Label for this recipe is unavailable.
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
        .content-overlay {
            background-color: rgba(255, 255, 255, 0.85);
        }
        `}
        </style>
    </>
    
  );
};

export default RecipeDetailPage;