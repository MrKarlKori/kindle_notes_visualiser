import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
      
      <svg viewBox="0 0 200 300" className="w-40 sm:w-48 h-auto mb-8 text-current">
        {/* Kindle Body */}
        <rect x="2" y="2" width="196" height="296" rx="10" fill="transparent" stroke="currentColor" strokeWidth="4" className="shadow-[4px_4px_0_0_currentColor]" />
        
        {/* Screen */}
        <rect x="15" y="20" width="170" height="220" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
        
        {/* Navigation Buttons (Left/Right) */}
        <line x1="2" y1="130" x2="15" y2="130" stroke="currentColor" strokeWidth="4" />
        <line x1="2" y1="170" x2="15" y2="170" stroke="currentColor" strokeWidth="4" />
        
        <line x1="185" y1="130" x2="198" y2="130" stroke="currentColor" strokeWidth="4" />
        <line x1="185" y1="170" x2="198" y2="170" stroke="currentColor" strokeWidth="4" />
        
        {/* Home Button */}
        <circle cx="100" cy="265" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
        
        {/* Sad Face / 404 text */}
        <text x="100" y="125" fontFamily="monospace" fontSize="48" fontWeight="bold" textAnchor="middle" fill="currentColor">
          X_X
        </text>
        <text x="100" y="175" fontFamily="monospace" fontSize="24" fontWeight="bold" textAnchor="middle" fill="currentColor">
          404
        </text>
        <text x="100" y="205" fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle" fill="currentColor">
          PAGE NOT FOUND
        </text>
      </svg>

      <h1 className="text-3xl font-bold uppercase tracking-widest mb-4">Error 404: Uncharted Territory</h1>
      
      <p className="max-w-md text-lg mb-8 opacity-80 border-l-4 border-current pl-4 text-left">
        Your Kindle seems to have lost its connection to the mothership. The page you are looking for has been deleted, misplaced, or never existed in this timeline.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/" 
          className="border-2 border-current px-6 py-3 font-bold uppercase tracking-wider hover:bg-blueprint-text hover:text-blueprint-bg dark:hover:bg-crt-text dark:hover:text-crt-bg transition-colors shadow-brutal dark:shadow-brutal-light hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:scale-95"
        >
          Return to Dashboard
        </Link>
        
        <a 
          href="https://en.wikipedia.org/wiki/Special:Random" 
          target="_blank" 
          rel="noopener noreferrer"
          className="border-2 border-current px-6 py-3 font-bold uppercase tracking-wider hover:bg-blueprint-text hover:text-blueprint-bg dark:hover:bg-crt-text dark:hover:text-crt-bg transition-colors shadow-brutal dark:shadow-brutal-light hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:scale-95 flex items-center justify-center gap-2"
        >
          Read Random Wikipedia
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
