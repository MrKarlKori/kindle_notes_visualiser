import React, { createContext, useState, useEffect, useContext } from 'react';
import { get, set } from 'idb-keyval';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'all');

  useEffect(() => {
    // Apply theme
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        // First check IndexedDB
        let storedNotes = await get('master_notes');
        
        if (!storedNotes || storedNotes.length === 0) {
          // If not in IDB, try fetching default from public
          const response = await fetch('./master_notes.json');
          if (response.ok) {
            storedNotes = await response.json();
            await set('master_notes', storedNotes);
          } else {
            storedNotes = [];
          }
        }
        
        setNotes(storedNotes || []);
      } catch (error) {
        console.error("Failed to load notes", error);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotes();
  }, []);

  const importNotes = async (parsedJson) => {
    setIsLoading(true);
    await set('master_notes', parsedJson);
    setNotes(parsedJson);
    setIsLoading(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <NotesContext.Provider value={{ 
      notes, 
      isLoading, 
      theme, 
      toggleTheme, 
      activeTab, 
      setActiveTab,
      importNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};
