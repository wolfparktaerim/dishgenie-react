// src/context/AppContext.tsx   

/*
  Provides global app state (auth, user, theme) via React Context.
  - Wrap your app with <AppProvider> to enable access.
  - Use `useAppContext()` to read/update state (e.g. login, logout, toggleTheme).
*/


'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our app state
interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  theme: 'light' | 'dark';
}

// Define the shape of user data
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the shape of our context value
interface AppContextValue extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleTheme: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    theme: 'light',
  });

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, we'll simulate a successful login with a mock user
      if (email && password) {
        setState({
          ...state,
          isAuthenticated: true,
          user: {
            id: '1',
            name: 'Demo User',
            email: email,
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setState({
      ...state,
      isAuthenticated: false,
      user: null,
    });
  };

  // Toggle theme function
  const toggleTheme = () => {
    setState({
      ...state,
      theme: state.theme === 'light' ? 'dark' : 'light',
    });
  };

  // Create the context value object
  const contextValue: AppContextValue = {
    ...state,
    login,
    logout,
    toggleTheme,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};