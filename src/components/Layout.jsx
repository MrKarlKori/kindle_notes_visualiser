import React from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { Monitor, Sun, Settings } from 'lucide-react';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useNotes();

  return (
    <div className="min-h-screen p-4 md:p-8 font-mono">
      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center border-b-2 border-current pb-4">
        <Link to="/" className="text-2xl font-bold uppercase tracking-wider hover:opacity-80 transition-opacity">
          Kindle_Visualizer.exe
        </Link>
        <nav className="flex gap-4 items-center">
          <Link to="/settings" className="hover:opacity-80 transition-opacity flex items-center gap-2">
            <Settings size={20} />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          <button 
            onClick={toggleTheme}
            className="p-2 border-2 border-current hover:bg-current hover:text-blueprint-bg dark:hover:text-crt-bg transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Monitor size={20} />}
          </button>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
