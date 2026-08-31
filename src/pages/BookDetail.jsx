import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';

const BookDetail = () => {
  const { bookTitle } = useParams();
  const { 
    notes, 
    isLoading, 
    filterType, 
    setFilterType, 
    filterLanguage, 
    setFilterLanguage, 
    filterFavorite,
    setFilterFavorite,
    availableLanguages,
    favorites
  } = useNotes();

  const author = useMemo(() => {
    return notes.find(n => n.book_title === bookTitle)?.author || 'Unknown';
  }, [notes, bookTitle]);

  const bookNotes = useMemo(() => {
    return notes
      .filter(n => {
        if (n.book_title !== bookTitle) return false;
        if (filterFavorite === 'Favorites' && !favorites.includes(n.id)) return false;
        if (filterType !== 'All' && n.type !== filterType) return false;
        if (filterLanguage !== 'All') {
          const noteLang = n.language && typeof n.language === 'string' && n.language.trim() !== '' 
            ? n.language.trim() 
            : 'Unspecified';
          if (noteLang !== filterLanguage) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const locA = parseInt(a.location.match(/\d+/)?.[0] || '0');
        const locB = parseInt(b.location.match(/\d+/)?.[0] || '0');
        return locA - locB;
      });
  }, [notes, bookTitle, filterType, filterLanguage, filterFavorite, favorites]);

  if (isLoading) return <div className="text-center animate-pulse mt-20 font-bold uppercase tracking-widest text-2xl">Loading Data...</div>;

  return (
    <div>
      <div className="mb-8 border-b-4 border-current pb-4">
        <Link to="/" className="text-sm mb-4 inline-block hover:underline font-bold uppercase tracking-wider text-blueprint-accent dark:text-crt-amber">&lt; Return to Dashboard</Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold uppercase mb-2">{bookTitle}</h1>
            <h2 className="text-xl">by <Link to={`/author/${encodeURIComponent(author)}`} className="hover:underline text-blueprint-accent dark:text-crt-amber">{author}</Link></h2>
          </div>
          <a 
            href={`https://www.goodreads.com/search?q=${encodeURIComponent(bookTitle)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm border-2 border-current px-2 py-1 inline-block hover:bg-blueprint-text hover:text-blueprint-bg dark:hover:bg-crt-text dark:hover:text-crt-bg transition-colors font-bold uppercase whitespace-nowrap self-start"
          >
            Search Goodreads &#8599;
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap justify-start sm:justify-end gap-2 mb-6">
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

        <select 
          value={filterFavorite} 
          onChange={e => setFilterFavorite(e.target.value)}
          className="bg-transparent border-2 border-current p-2 sm:p-1 uppercase text-sm outline-none font-bold cursor-pointer w-full sm:w-auto"
        >
          <option value="All" className="bg-blueprint-bg dark:bg-crt-bg text-current">All Notes</option>
          <option value="Favorites" className="bg-blueprint-bg dark:bg-crt-bg text-current">Favorites Only</option>
        </select>
      </div>

      <div>
        {bookNotes.map(note => (
          <NoteCard key={note.id} note={note} showMetadata={false} />
        ))}
      </div>

      {bookNotes.length === 0 && <div className="text-center uppercase tracking-widest opacity-70">No records found for this book matching current filter.</div>}
    </div>
  );
};

export default BookDetail;
