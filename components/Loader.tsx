'use client';

import React from 'react';

interface LoaderProps {
  className?: string;
  size?: 'small' | 'default' | 'large';
}

const Loader = ({ className = '', size = 'default' }: LoaderProps) => {
  // Size classes
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-gray-300 border-t-black ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Loader;