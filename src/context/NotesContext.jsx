import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { get, set } from 'idb-keyval';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'all');
  const [filterType, setFilterType] = useState('All');
  const [filterLanguage, setFilterLanguage] = useState('All');
  const [filterFavorite, setFilterFavorite] = useState('All');
  const [favorites, setFavorites] = useState([]);

  const availableLanguages = useMemo(() => {
    const langSet = new Set();
    let hasUnspecified = false;
    notes.forEach(note => {
      if (note.language && typeof note.language === 'string' && note.language.trim() !== '') {
        langSet.add(note.language.trim());
      } else {
        hasUnspecified = true;
      }
    });
    const sorted = Array.from(langSet).sort((a, b) => a.localeCompare(b));
    if (hasUnspecified) {
      sorted.push('Unspecified');
    }
    return sorted;
  }, [notes]);

  useEffect(() => {
    // Apply theme
    const root = window.document.documentElement;
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#000000');
    } else {
      root.classList.remove('dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#f4ebd8');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const loadData = async () => {
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

        // Load favorites
        let storedFavorites = await get('favorite_notes');
        setFavorites(storedFavorites || []);
      } catch (error) {
        console.error("Failed to load data", error);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
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

  const toggleFavorite = (noteId) => {
    setFavorites(prev => {
      const newFavs = prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId];
      set('favorite_notes', newFavs);
      return newFavs;
    });
  };

  return (
    <NotesContext.Provider value={{ 
      notes, 
      isLoading, 
      theme, 
      toggleTheme, 
      activeTab, 
      setActiveTab,
      filterType,
      setFilterType,
      filterLanguage,
      setFilterLanguage,
      filterFavorite,
      setFilterFavorite,
      availableLanguages,
      importNotes,
      favorites,
      toggleFavorite
    }}>
      {children}
    </NotesContext.Provider>
  );
};
