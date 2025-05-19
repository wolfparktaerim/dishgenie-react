import React, { useState, useEffect, useRef } from 'react';

interface NumberCounterProps {
  endValue: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  delay?: number;
  duration?: number;
}

const NumberCounter: React.FC<NumberCounterProps> = ({
  endValue,
  suffix = '',
  prefix = '',
  decimals = 0,
  delay = 0,
  duration = 2000
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const startTime = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Create easeOutExpo easing function
  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  // Animation function
  const animate = (timestamp: number) => {
    if (!startTime.current) {
      startTime.current = timestamp;
    }

    const elapsed = timestamp - startTime.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    
    const newValue = easedProgress * endValue;
    setCount(newValue);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setCount(endValue);
    }
  };

  // Setup Intersection Observer to only start counting when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [isVisible]);

  // Start animation with delay when component becomes visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        startTime.current = null;
        animationFrameRef.current = requestAnimationFrame(animate);
      }, delay);

      return () => {
        clearTimeout(timer);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isVisible, delay, endValue, duration]);

  // Format the number with proper decimal places
  const formattedNumber = count.toFixed(decimals);

  return (
    <span ref={counterRef}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
};

export default NumberCounter;