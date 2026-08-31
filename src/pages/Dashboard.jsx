import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const { 
    notes, 
    isLoading, 
    activeTab, 
    setActiveTab, 
    filterType, 
    setFilterType, 
    filterLanguage, 
    setFilterLanguage, 
    filterFavorite,
    setFilterFavorite,
    availableLanguages,
    favorites
  } = useNotes();
  const [sortOrder, setSortOrder] = useState('date-desc');

  const tabs = [
    { id: 'all', label: 'See All' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'authors', label: 'Authors' },
    { id: 'books', label: 'Books' }
  ];

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      if (activeTab === 'favorites' && !favorites.includes(n.id)) {
        return false;
      }
      if (filterFavorite === 'Favorites' && !favorites.includes(n.id)) {
        return false;
      }
      if (filterType !== 'All' && n.type !== filterType) {
        return false;
      }
      if (filterLanguage !== 'All') {
        const noteLang = n.language && typeof n.language === 'string' && n.language.trim() !== '' 
          ? n.language.trim() 
          : 'Unspecified';
        if (noteLang !== filterLanguage) {
          return false;
        }
      }
      return true;
    });
  }, [notes, filterType, filterLanguage, filterFavorite, activeTab, favorites]);

  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      if (sortOrder === 'title-asc') {
        return a.book_title.localeCompare(b.book_title);
      }
      const dateA = new Date(a.date_added).getTime() || 0;
      const dateB = new Date(b.date_added).getTime() || 0;
      return sortOrder === 'date-desc' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredNotes, sortOrder]);

  const authors = useMemo(() => {
    const counts = filteredNotes.reduce((acc, note) => {
      acc[note.author] = (acc[note.author] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredNotes]);

  const books = useMemo(() => {
    const counts = filteredNotes.reduce((acc, note) => {
      acc[note.book_title] = (acc[note.book_title] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredNotes]);

  if (isLoading) return <div className="text-center animate-pulse mt-20 font-bold uppercase tracking-widest text-2xl">Loading Data...</div>;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center border-b-2 border-current mb-6 pb-3 gap-3">
        <div className="flex overflow-x-auto max-w-full pb-1 sm:pb-0 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 uppercase font-bold border-2 border-transparent whitespace-nowrap shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-blueprint-text text-blueprint-bg dark:bg-crt-text dark:text-crt-bg' 
                  : 'hover:bg-blueprint-text/10 dark:hover:bg-crt-text/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto justify-start sm:justify-end">
          <select 
            value={filterLanguage} 
            onChange={e => setFilterLanguage(e.target.value)}
            className="bg-transparent border-2 border-current p-2 sm:p-1 uppercase text-sm outline-none font-bold cursor-pointer w-full sm:w-auto"
          >
            <option value="All" className="bg-blueprint-bg dark:bg-crt-bg text-current">All Languages</option>
            {availableLanguages.map(lang => (
              <option key={lang} value={lang} className="bg-blueprint-bg dark:bg-crt-bg text-current">
                {lang}
              </option>
            ))}
          </select>

          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="bg-transparent border-2 border-current p-2 sm:p-1 uppercase text-sm outline-none font-bold cursor-pointer w-full sm:w-auto"
          >
            <option value="All" className="bg-blueprint-bg dark:bg-crt-bg text-current">All Types</option>
            <option value="Highlight" className="bg-blueprint-bg dark:bg-crt-bg text-current">Highlights Only</option>
            <option value="Note" className="bg-blueprint-bg dark:bg-crt-bg text-current">Notes Only</option>
          </select>

          {activeTab !== 'favorites' && (
            <select 
              value={filterFavorite} 
              onChange={e => setFilterFavorite(e.target.value)}
              className="bg-transparent border-2 border-current p-2 sm:p-1 uppercase text-sm outline-none font-bold cursor-pointer w-full sm:w-auto"
            >
              <option value="All" className="bg-blueprint-bg dark:bg-crt-bg text-current">All Notes</option>
              <option value="Favorites" className="bg-blueprint-bg dark:bg-crt-bg text-current">Favorites Only</option>
            </select>
          )}

          {(activeTab === 'all' || activeTab === 'favorites') && (
            <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)}
              className="bg-transparent border-2 border-current p-2 sm:p-1 uppercase text-sm outline-none font-bold cursor-pointer w-full sm:w-auto"
            >
              <option value="date-desc" className="bg-blueprint-bg dark:bg-crt-bg text-current">Newest First</option>
              <option value="date-asc" className="bg-blueprint-bg dark:bg-crt-bg text-current">Oldest First</option>
              <option value="title-asc" className="bg-blueprint-bg dark:bg-crt-bg text-current">Title A-Z</option>
            </select>
          )}
        </div>
      </div>

      {(activeTab === 'all' || activeTab === 'favorites') && (
        <div>
          {sortedNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
          {sortedNotes.length === 0 && <div className="text-center mt-10 uppercase tracking-widest opacity-70">No records found matching current filter.</div>}
        </div>
      )}

      {activeTab === 'authors' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {authors.map(([author, count]) => (
              <Link 
                key={author} 
                to={`/author/${encodeURIComponent(author)}`}
                className="border-2 border-current p-4 hover:bg-blueprint-text hover:text-blueprint-bg dark:hover:bg-crt-text dark:hover:text-crt-bg transition-colors flex justify-between items-center group bg-white/5 dark:bg-black/50"
              >
                <span className="font-bold truncate mr-2" title={author}>{author}</span>
                <span className="text-sm px-2 py-1 border border-current group-hover:border-transparent font-bold">
                  {count}
                </span>
              </Link>
            ))}
          </div>
          {authors.length === 0 && <div className="text-center mt-10 uppercase tracking-widest opacity-70">No authors found matching current filter.</div>}
        </div>
      )}

      {activeTab === 'books' && (
        <div>
          <div className="flex flex-col gap-4">
            {books.map(([book, count]) => (
              <Link 
                key={book} 
                to={`/book/${encodeURIComponent(book)}`}
                className="border-2 border-current p-4 hover:bg-blueprint-text hover:text-blueprint-bg dark:hover:bg-crt-text dark:hover:text-crt-bg transition-colors flex justify-between items-center group bg-white/5 dark:bg-black/50"
              >
                <span className="font-bold truncate mr-4" title={book}>{book}</span>
                <span className="text-sm px-2 py-1 border border-current group-hover:border-transparent whitespace-nowrap font-bold uppercase">
                  {count} entries
                </span>
              </Link>
            ))}
          </div>
          {books.length === 0 && <div className="text-center mt-10 uppercase tracking-widest opacity-70">No books found matching current filter.</div>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
