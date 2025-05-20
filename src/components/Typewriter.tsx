// src/components/Typewriter.tsx

/*
  A React functional component showing a typewriter effect that cycles through phrases with dynamic words, typing and deleting them with a blinking cursor. 

  You can customize texts by editing the `baseStructures` array inside the component.
  
  To use, import it via ` import Typewriter from '@/components/Typewriter' ` and include `<Typewriter />` in your TSX. 

*/

'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Structure {
  prefix: string;
  changing: string[];
  suffix: string;
}

const baseStructures: Structure[] = [
  { prefix: "Got ", changing: ["leftovers", "ingredients", "groceries"], suffix: "?" },
  { prefix: "Craving ", changing: ["something spicy", "Asian food", "Italian"], suffix: "?" },
  { prefix: "Need a ", changing: ["quick dinner", "breakfast", "lunch"], suffix: " idea?" },
  { prefix: "Feeling ", changing: ["adventurous", "creative", "inspired"], suffix: "?" },
  { prefix: "What's in ", changing: ["season", "your pantry", "the fridge"], suffix: " now?" }
];

const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_TIME = 2000;

const Typewriter: React.FC = () => {
  const [structureIndex, setStructureIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentStructure = baseStructures[structureIndex];
  const currentWord = currentStructure.changing[wordIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, TYPING_SPEED);
      } else {
        // Pause at full word before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_TIME);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, DELETING_SPEED);
      } else {
        // Move to next word and possibly next structure
        timeout = setTimeout(() => {
          setIsDeleting(false);
          const nextWordIndex = (wordIndex + 1) % currentStructure.changing.length;
          setWordIndex(nextWordIndex);

          if (nextWordIndex === 0) {
            setStructureIndex((structureIndex + 1) % baseStructures.length);
          }
        }, TYPING_SPEED);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, structureIndex, currentWord, currentStructure.changing.length]);

  return (
    <div className="text-5xl text-gray-800 font-bold text-center mb-8">
      {currentStructure.prefix}
      <span className="text-purple-600">
        {displayText}
        <span className="cursor-blink">|</span>
      </span>
      {currentStructure.suffix}
    </div>
  );
};

export default Typewriter;