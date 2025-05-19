// src/components/Carousel.tsx

'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

// Types for our component
interface FoodItem {
  id: number;
  name: string;
  cuisine: string;
  image: string;
}

interface FoodCarouselProps {
  initialSpeed?: number;
}

// Styled components
const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const CarouselTrack = styled.div<{ $translateX: number }>`
  display: flex;
  transform: translateX(${props => props.$translateX}px);
  transition: transform 0.1s linear;
`;

const ItemContainer = styled.div`
  flex-shrink: 0;
  width: 220px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  border: 1px solid #e2e8f0;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-0.25rem);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 10rem;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  font-weight: bold;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  color: #805ad5;
`;

const CardSubtitle = styled.p`
  font-size: 0.875rem;
  color: #718096;
`;

const Carousel: React.FC<FoodCarouselProps> = ({ initialSpeed = 0.5 }) => {
  const [translateX, setTranslateX] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [baseSpeed, setBaseSpeed] = useState(initialSpeed);
  const [currentSpeed, setCurrentSpeed] = useState(initialSpeed);
  const animationRef = useRef<number>();

  const items: FoodItem[] = [
    { id: 1, name: "Korean Rice with Vegetables & Beef", cuisine: "Korean", image: "food/beef-bimbimbap.jpg" },
    { id: 2, name: "Cauliflower Fried Rice", cuisine: "Chinese", image: "food/cauliflower-fried-rice.jpg" },
    { id: 3, name: "Coconut Curry Mackeral Rice", cuisine: "Indian", image: "food/coconut-curry-mackerel.jpg" },
    { id: 4, name: "Pho with Zucchini Noodles", cuisine: "Vietnamese", image: "food/pho-with-zucchini-noodles.jpg" },
    { id: 5, name: "Salmon Quinoa Risotto", cuisine: "Italian", image: "food/salmon-quinoa-risotto.jpg" },
    { id: 6, name: "Slow Cooker Chicken Taco Soup", cuisine: "Mexican", image: "food/slow-cooker-chicken-taco-soup.jpg" },
    { id: 7, name: "Baked Sweet Potato Fries", cuisine: "American", image: "food/sweet-potato-fries.jpg" },
    { id: 8, name: "Teriyaki Chicken Soba", cuisine: "Japanese", image: "food/teriyaki-chicken-soba.jpg" },
    { id: 9, name: "Thai Green Mango Salad", cuisine: "Thai", image: "food/thai-green-mango-salad.jpg" },
    { id: 10, name: "Chicken, Sausage & Shrimp Paella", cuisine: "Spanish", image: "food/chicken-sausage-shrimp-paella.jpg" },
  ];

  // Triple the items for smooth infinite scrolling
  const tripleItems = [...items, ...items, ...items];

  const handleMouseEnter = () => {
    setHovering(true);
    setCurrentSpeed(baseSpeed / 4);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setCurrentSpeed(baseSpeed);
  };

  const animateCarousel = () => {
    setTranslateX(prevTranslateX => {
      const newTranslateX = prevTranslateX - currentSpeed;
      const itemWidth = 220;
      const totalWidth = items.length * itemWidth;
      
      // Reset position when we've scrolled the width of the original items
      if (Math.abs(newTranslateX) >= totalWidth) {
        return newTranslateX + totalWidth;
      }
      
      return newTranslateX;
    });
    
    animationRef.current = requestAnimationFrame(animateCarousel);
  };

  // Public method equivalent
  const changeSpeed = (newSpeed: number) => {
    setBaseSpeed(newSpeed);
    if (!hovering) {
      setCurrentSpeed(newSpeed);
    } else {
      setCurrentSpeed(newSpeed / 4);
    }
  };

  useEffect(() => {
    // Start animation on mount
    animationRef.current = requestAnimationFrame(animateCarousel);
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentSpeed]); // Re-run effect when currentSpeed changes

  return (
    <CarouselContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselTrack
        $translateX={translateX}
        style={{ width: `${tripleItems.length * 220}px` }}
      >
        {tripleItems.map((item, index) => (
          <ItemContainer key={`${item.id}-${index}`}>
            <Link href="/search">
              <Card>
                <CardImage src={item.image} alt={item.name} />
                <CardContent>
                  <CardTitle>{item.name}</CardTitle>
                  <CardSubtitle>{item.cuisine}</CardSubtitle>
                </CardContent>
              </Card>
            </Link>
          </ItemContainer>
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );
};

export default Carousel;