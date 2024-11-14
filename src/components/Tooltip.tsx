import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: true, right: false });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!tooltipRef.current || !containerRef.current) return;
      
      const tooltip = tooltipRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      setPosition({
        top: container.top > tooltip.height,
        right: viewportWidth - container.right < tooltip.width
      });
    };

    if (isVisible) {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isVisible]);

  const isMobile = () => window.innerWidth <= 768;

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile()) {
      setIsVisible(!isVisible);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile()) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile()) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible && isMobile()) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isVisible]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`
            ${isMobile() ? 'fixed' : 'absolute'}
            z-50
            ${isMobile() ? 'w-[calc(100vw-2rem)]' : 'w-64'}
            p-3 
            text-sm text-white 
            bg-gray-900/95 
            backdrop-blur-sm 
            rounded-lg 
            shadow-lg 
            border 
            border-gray-700
            transition-opacity 
            duration-200
            ${isMobile()
              ? `${position.top ? 'bottom-4' : 'top-4'} ${position.right ? 'right-4' : 'left-4'}`
              : `${position.top ? 'top-full mt-2' : 'bottom-full mb-2'} ${position.right ? 'right-0' : 'left-0'}`
            }
          `}
        >
          {content}
          {isMobile() && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="absolute top-1 right-1 p-1 text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}