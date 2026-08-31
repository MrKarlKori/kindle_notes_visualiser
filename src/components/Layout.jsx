import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { Monitor, Sun, Settings } from 'lucide-react';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useNotes();
  const location = useLocation();
  const isSettings = location.pathname === '/settings';

  return (
    <div className="min-h-screen p-4 md:p-8 font-mono">
      <header className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-b-2 border-current pb-4">
        <div className="relative group text-center sm:text-left w-full sm:w-auto">
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold uppercase tracking-wider hover:opacity-80 transition-opacity block truncate"
          >
            Kindle_Visualizer.exe
          </Link>
          <div className="absolute left-0 top-full mt-1 hidden sm:group-hover:block bg-blueprint-text text-blueprint-bg dark:bg-crt-text dark:text-crt-bg text-xs px-2 py-1 border border-current font-bold uppercase whitespace-nowrap z-20 pointer-events-none shadow-sm">
            Go to Dashboard
          </div>
        </div>
        <nav className="flex gap-4 items-center justify-center w-full sm:w-auto">
          <div className="relative group">
            <Link 
              to="/settings" 
              className={`p-2 border-2 border-current flex items-center gap-2 transition-colors ${
                isSettings 
                  ? 'bg-blueprint-text text-blueprint-bg dark:bg-crt-text dark:text-crt-bg font-bold' 
                  : 'hover:bg-blueprint-text hover:text-blueprint-bg dark:hover:bg-crt-text dark:hover:text-crt-bg'
              }`}
            >
              <Settings size={20} />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-blueprint-text text-blueprint-bg dark:bg-crt-text dark:text-crt-bg text-xs px-2 py-1 border border-current font-bold uppercase whitespace-nowrap z-20 pointer-events-none shadow-sm">
              System Settings
            </div>
          </div>
          <div className="relative group">
            <button 
              onClick={toggleTheme}
              // title={theme === 'dark' ? 'Switch to Blueprint Light Mode' : 'Switch to Retro CRT Mode'}
              className="p-2 border-2 border-current hover:bg-blueprint-text hover:text-blueprint-bg dark:hover:bg-crt-text dark:hover:text-crt-bg transition-colors flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Monitor size={20} />}
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-blueprint-text text-blueprint-bg dark:bg-crt-text dark:text-crt-bg text-xs px-2 py-1 border border-current font-bold uppercase whitespace-nowrap z-20 pointer-events-none shadow-sm">
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Retro CRT Mode'}
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
