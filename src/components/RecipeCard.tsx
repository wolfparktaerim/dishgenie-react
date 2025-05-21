// src/components/RecipeCard.tsx

/*
    This is recipe card component: it takes in recipes data from the Search main view and display all the recipes in card format, each recipe card contains their own basic information.
    
    Basic information includes: recipe image, recipe name (title), preparation time (in minutes), serving size, and etc

    On the top right side of the image there is also a badge section that display the 'badges' of the recipe, to show whether the recipe is 'veryHealthy', 'veryPopular' and etc.

    To use, import it via ` import RecipeCard from '@/components/RecipeCard' ` and include `<RecipeCard />` in your TSX. 
*/

import React from 'react';
import { Recipe } from '@/types/Recipe';
import Image from 'next/image';
import Link from 'next/link';


interface RecipeCardProps {
    recipes: Recipe[];
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipes }) => {
    if (!recipes || recipes.length === 0) {
        return null;
    }

    return (
        <>
            {recipes.map((recipe) => (
                <article
                    key={recipe.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                    aria-labelledby={`recipe-title-${recipe.id}`}
                >
                    {/* Recipe Image */}
                    <div className="relative pb-[56.25%] bg-gray-200">
                        {recipe.image ? (
                            <img
                                src={recipe.image}
                                alt='recipe_image'
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-gray-400"
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

                        {/* Badges Section */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                            {recipe.veryHealthy && (
                                <div className="relative group">
                                    <div className="bg-white rounded-full p-2 shadow-md border border-gray-300">
                                        <Image src="/icon/healthy.png" width={24} height={24} alt="Healthy" />
                                    </div>
                                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ml-2">Healthy Choice!</span>
                                </div>
                            )}

                            {recipe.vegan && (
                                <div className="relative group">
                                    <div className="bg-white rounded-full p-2 shadow-md border border-gray-300">
                                        <Image src="/icon/vegan.png" width={24} height={24} alt="Vegan" />
                                    </div>
                                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ml-2">Vegan Dish</span>
                                </div>
                            )}

                            {recipe.veryPopular && (
                                <div className="relative group">
                                    <div className="bg-white rounded-full p-2 shadow-md border border-gray-300">
                                        <Image src="/icon/popular.png" width={24} height={24} alt="Popular" />
                                    </div>
                                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ml-2">Popular Dish</span>
                                </div>
                            )}

                            {recipe.cheap && (
                                <div className="relative group">
                                    <div className="bg-white rounded-full p-2 shadow-md border border-gray-300">
                                        <Image src="/icon/cheap.png" width={24} height={24} alt="Cheap" />
                                    </div>
                                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ml-2">Cheap to make</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recipe Content */}
                    <div className="p-4 flex-grow flex flex-col">
                        <h2
                            id={`recipe-title-${recipe.id}`}
                            className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2"
                        >
                            {recipe.title}
                        </h2>

                        {/* Recipe Meta Info */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {/* Ready Time */}
                            <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {recipe.readyInMinutes} min
                            </span>

                            {/* Servings */}
                            <span className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"
                                    />
                                </svg>
                                {recipe.servings} servings
                            </span>
                        </div>

                        {/* Diet, Cuisine, and Diet Labels */}
                        <div className="flex flex-wrap gap-1 mb-4">
                            {recipe.vegetarian && (
                                <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded">
                                    Vegetarian
                                </span>
                            )}
                            {recipe.vegan && (
                                <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded">
                                    Vegan
                                </span>
                            )}
                            {recipe.glutenFree && (
                                <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded">
                                    Gluten Free
                                </span>
                            )}
                            {recipe.dairyFree && (
                                <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded">
                                    Dairy Free
                                </span>
                            )}
                            {recipe.cuisines?.length > 0 && recipe.cuisines.slice(0, 1).map((cuisine, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded">
                                    {cuisine}
                                </span>
                            ))}
                        </div>

                        {/* Used Ingredients List */}
                        <div className="mt-auto">
                            {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-medium text-gray-700 mb-1">Matching Ingredients:</h3>
                                    <ul className="text-xs text-gray-600 pl-4 list-disc">
                                        {recipe.usedIngredients.slice(0, 3).map((ingredient, index) => (
                                            <li key={index}>{ingredient.name}</li>
                                        ))}
                                        {recipe.usedIngredients.length > 3 && (
                                            <li className="text-gray-500">+{recipe.usedIngredients.length - 3} more</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Missing Ingredients - optional */}
                            {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                                <div className="mt-2">
                                    <h3 className="text-xs font-medium text-gray-700 mb-1">Missing Ingredients:</h3>
                                    <ul className="text-xs text-gray-600 pl-4 list-disc">
                                        {recipe.missedIngredients.slice(0, 2).map((ingredient, index) => (
                                            <li key={index}>{ingredient.name}</li>
                                        ))}
                                        {recipe.missedIngredients.length > 2 && (
                                            <li className="text-gray-500">+{recipe.missedIngredients.length - 2} more</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* View Recipe Button */}
                        <div className="mt-4">
                            <a
                                href={`/recipe/${recipe.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                aria-label={`View recipe`}
                            >
                                View Recipe
                            </a>
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
};

export default RecipeCard;