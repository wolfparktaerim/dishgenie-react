// src/components/layout/Navigation.tsx

/*
  This is the Navigation bar component, it is present in every page of the app.

  It behaves differently in 4 situations:

    - Large Screen, user authenticated: shows a standard navigation bar with 5 tabs (Search, Discover, Mini Game, Saved and User Profile)
    - Large Screen, user not authenticated: shows a navigation bar with 2 tabs (How It Works & Log In)
    - Small Screen, user authenticated: a humburger toggle button that can extend into a menu of 5 tabs (Search, Discover, Mini Game, Saved and User Profile)
    - Small Screen, user not authenticated: a humburger toggle button that can extend into a menu of 2 tabs (How It Works & Log In)
    
*/

'use client';

import { useState, useEffect, useRef } from 'react';
import { LoginModal } from '@/components/modals/LoginModal';

// Import 'next/link' for routing
import Link from 'next/link';


import {
  Search,
  Globe,
  Bookmark,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Gamepad2,
  Info
} from 'lucide-react';

interface NavigationProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isAuthenticated = true,
  onLogin = () => { },
  onLogout = () => { }
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const login = () => {
    onLogin();
    setMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-20 transition-all duration-300 border-b border-gray-200 ${isScrolled ? 'bg-white/70 backdrop-blur-sm' : ''
          }`}
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors duration-300"
            >
              DishGenie
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search is available for both logged-in and logged-out users */}
            <Link
              href="/search"
              className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>

            {/* Logged out navigation */}
            {!isAuthenticated ? (
              <>
                <a
                  href="#HowItWorks"
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
                >
                  <Info className="w-4 h-4" />
                  <span>How It Works</span>
                </a>
                <button
                  onClick={login}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/discover"
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
                >
                  <Globe className="w-4 h-4" />
                  <span>Discover</span>
                </Link>
                <Link
                  href="/minigame"
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Mini Game</span>
                </Link>
                <Link
                  href="/saved"
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Saved</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 focus:outline-none"
                  >
                    <User className="w-6 h-6" />
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={confirmLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-purple-600 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu with Animation */}
        <div
          className={`
            md:hidden bg-white px-4 py-2 shadow-md overflow-hidden transition-all duration-500 ease-in-out
            ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <Link
            href="/search"
            className="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Link>

          {/* Logged out mobile navigation */}
          {!isAuthenticated ? (
            <>
              <a
                href="#HowItWorks"
                className="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Info className="w-4 h-4" />
                <span>How It Works</span>
              </a>
              <button
                onClick={login}
                className="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
              >
                Log In
              </button>
            </>
          ) : (
            <>
              <Link
                href="/discover"
                className="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Globe className="w-4 h-4" />
                <span>Discover</span>
              </Link>

              <Link
                href="/minigame"
                className="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Mini Game</span>
              </Link>

              <Link
                href="/saved"
                className="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved</span>
              </Link>

              <Link
                href="/profile"
                className="block py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={confirmLogout}
                className="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 transition-opacity"></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md mx-4 relative transform transition-all">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <LogOut className="w-5 h-5 text-purple-600 mr-2" />
                Confirm Log Out
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;