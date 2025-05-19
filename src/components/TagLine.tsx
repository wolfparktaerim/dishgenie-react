// src/components/Tagline.tsx

'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

interface TagLineProps {
  className?: string;
  id?:string;
  onShowLogin: () => void;
  onShowVideo: () => void;
}

// Keyframes for the gradient animation
const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled components
const GradientText = styled.span`
  background: linear-gradient(to right, #d8b4fe, #8b5cf6);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientShift} 8s ease infinite;
`;

const Button = styled.button`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    transform: scaleX(1);
    transform-origin: 0 50%;
    transition-property: transform;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
  }
  
  &:hover::before {
    transform: scaleX(1.05);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.25);
  }
`;

const PrimaryButton = styled(Button)`
  /* The Tailwind classes will be applied in the JSX */
`;

const SecondaryButton = styled(Button)`
  /* The Tailwind classes will be applied in the JSX */
`;

const TagLine: React.FC<TagLineProps> = ({ className = '', onShowLogin, onShowVideo }) => {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white py-20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-10 top-1/4 h-64 w-64 rounded-full bg-purple-100/50"
        ></div>
        <div
          className="absolute -left-10 top-1/3 h-48 w-48 rounded-full bg-purple-100/30"
        ></div>
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Heading */}
          <h1 className="mb-6 text-center">
            <span
              className="block text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl"
            >
              <GradientText>Discover Healthy Recipes</GradientText>
            </span>
            <span
              className="mt-2 block text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl"
            >
              <GradientText>For a Healthier Tomorrow</GradientText>
            </span>
          </h1>

          {/* Subheading */}
          <p className="mb-12 max-w-2xl text-center text-lg text-gray-600 md:text-xl">
            Explore simple, delicious, and nutritious meals crafted for your
            wellness journey. Join thousands of food lovers making healthier
            choices every day.
          </p>
          
          {/* CTA Buttons */}
          <div
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
          >
            <PrimaryButton
              onClick={onShowLogin}
              className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-purple-700 hover:shadow-purple-200 hover:-translate-y-1 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group"
            >
              <span className="relative z-10">Get Started for Free</span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5 relative z-10 transition-all duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </PrimaryButton>
            <SecondaryButton
              onClick={onShowVideo}
              className="inline-flex items-center justify-center rounded-xl border-2 border-purple-200 bg-white px-8 py-4 text-lg font-semibold text-purple-600 transition-all hover:bg-purple-50 hover:shadow-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 hover:-translate-y-1 group"
            >
              <span className="relative z-10">Watch Demo</span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-100 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5 relative z-10 transition-transform duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TagLine;