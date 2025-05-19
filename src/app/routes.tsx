// src/app/routes.tsx
// This file provides a centralized place to manage routes in your application

// export const routes = {
//   home: '/',
//   search: '/search',
//   recipeDetail: (id: string) => `/recipes/${id}`,

// };

// // Helper function to navigate in a type-safe way
// export const getRoute = (route: keyof typeof routes, ...params: string[]): string => {
//   const path = routes[route];
//   if (typeof path === 'function') {
//     return path(...params);
//   }
//   return path;
// };