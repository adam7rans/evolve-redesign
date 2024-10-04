import React from 'react';
import Link from 'next/link';

interface SubHeaderProps {
  title: string;
  buttonLabel: string;
  buttonLink: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
}

export function SubHeader({ title, buttonLabel, buttonLink, onButtonClick, buttonDisabled }: SubHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <button
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
            buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}