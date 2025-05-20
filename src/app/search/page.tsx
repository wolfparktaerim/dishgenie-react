// src/app/search/page.tsx 

/*
 Search recipe page that organizes other search-recipe-related components.
 
 It includes the navigation component, a (fancy) animated title component, search engine component and the recipe cards component. 
*/

'use client';

import React from 'react';
import { useState } from 'react';

import Navigation from '@/components/layout/Navigation';
import Typewriter from '@/components/Typewriter';
import SearchEngine from '@/components/SearchEngine';
import RecipeCard from '@/components/RecipeCard';


export default function SearchPage() {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [searchTriggered, setSearchTriggered] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchNum, setSearchNum] = React.useState<number>(0);

  // Effect to load recipes from sessionStorage on initial render 
  React.useEffect(() => {
    const storedRecipes = sessionStorage.getItem('lastSearchResults');
    const storedSearchTriggered = sessionStorage.getItem('searchTriggered');

    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }

    if (storedSearchTriggered) {
      setSearchTriggered(JSON.parse(storedSearchTriggered));
    }

    // Event listener to clear session storage before unload
    const clearSessionStorage = () => {
      sessionStorage.removeItem('lastSearchResults');
      sessionStorage.removeItem('searchTriggered');
    };

    window.addEventListener('beforeunload', clearSessionStorage);
    return () => {
      window.removeEventListener('beforeunload', clearSessionStorage);
    };
  }, []);


  // Function to handle search results
  const handleSearchResults = (
    results: Recipe[],
    totalResults: number,
    searchWasTriggered: boolean
  ) => {
    setRecipes(results);
    setSearchTriggered(searchWasTriggered);
    setSearchNum(totalResults);

    // Store in session storage
    if (totalResults < 2000) {
      sessionStorage.setItem('lastSearchResults', JSON.stringify(results));
      sessionStorage.setItem('searchTriggered', JSON.stringify(searchWasTriggered));
    }
  };

  // Function to update loading state
  const updateLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="container mx-auto py-8 px-4 mt-8">
          <Typewriter />

          {/* Search Engine Component */}
          <SearchEngine
            onSearchResults={handleSearchResults}
            updateLoadingState={updateLoadingState}
          />

          {/* Loading State */}
          {isLoading && (
            <div
              className="flex flex-col items-center justify-center space-y-4 mt-12"
              role="status"
              aria-label="Loading recipes"
            >
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-purple-300 rounded-full"></div>
              </div>
              <p className="text-gray-600">Finding perfect recipes...</p>
            </div>
          )}

          {/* Results Section */}
          {!isLoading && (
            <section aria-label="Recipe Results">

              {/* No Results Message */}
              {searchTriggered && (recipes.length === 0 || searchNum === 5151) && (
                <div className="flex flex-col items-center justify-center h-64 mt-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-600">No recipes found</p>
                  <p className="text-gray-500 mt-2">Try different ingredients or filters</p>
                </div>
              )}

              {/* Recipe Grid */}
              {recipes.length > 0 && searchNum !== 5151 && (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
                  role="grid"
                  aria-label="Recipe results"
                >
                  <RecipeCard recipes={recipes} />
                </div>
              )}
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
