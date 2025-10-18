"use client";

import { useEffect, useRef, useState } from 'react';

interface AnimatedLineProps {
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  length?: number;
  thickness?: number;
  color?: string;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedLine({
  direction = 'horizontal',
  length = 100,
  thickness = 2,
  color = 'currentColor',
  delay = 0,
  duration = 1000,
  className = ''
}: AnimatedLineProps) {
  const [isVisible, setIsVisible] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getLineStyle = () => {
    const baseStyle = {
      backgroundColor: color,
      transition: `width ${duration}ms ease-out, height ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      opacity: isVisible ? 1 : 0
    };

    switch (direction) {
      case 'horizontal':
        return {
          ...baseStyle,
          width: isVisible ? `${length}px` : '0px',
          height: `${thickness}px`
        };
      case 'vertical':
        return {
          ...baseStyle,
          height: isVisible ? `${length}px` : '0px',
          width: `${thickness}px`
        };
      case 'diagonal':
        return {
          ...baseStyle,
          width: isVisible ? `${length}px` : '0px',
          height: `${thickness}px`,
          transform: 'rotate(45deg)',
          transformOrigin: 'left center'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      ref={lineRef}
      className={`inline-block ${className}`}
      style={getLineStyle()}
    />
  );
}

