import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';

const BookDetail = () => {
  const { bookTitle } = useParams();
  const { notes, isLoading } = useNotes();
  const [filterType, setFilterType] = useState('All');

  const bookNotes = useMemo(() => {
    return notes
      .filter(n => n.book_title === bookTitle)
      .sort((a, b) => {
        const locA = parseInt(a.location.match(/\d+/)?.[0] || '0');
        const locB = parseInt(b.location.match(/\d+/)?.[0] || '0');
        return locA - locB;
      });
  }, [notes, bookTitle]);

  const filteredNotes = useMemo(() => {
    if (filterType === 'All') return bookNotes;
    return bookNotes.filter(n => n.type === filterType);
  }, [bookNotes, filterType]);

  const author = bookNotes.length > 0 ? bookNotes[0].author : 'Unknown';

  if (isLoading) return <div className="text-center animate-pulse mt-20 font-bold uppercase tracking-widest text-2xl">Loading Data...</div>;

  return (
    <div>
      <div className="mb-8 border-b-4 border-current pb-4">
        <Link to="/" className="text-sm mb-4 inline-block hover:underline font-bold uppercase tracking-wider text-blueprint-accent dark:text-crt-amber">&lt; Return to Dashboard</Link>
        <h1 className="text-3xl font-bold uppercase mb-2">{bookTitle}</h1>
        <h2 className="text-xl mb-4">by <Link to={`/author/${encodeURIComponent(author)}`} className="hover:underline text-blueprint-accent dark:text-crt-amber">{author}</Link></h2>
        
        <div className="flex gap-4">
          <a 
            href={`https://www.goodreads.com/search?q=${encodeURIComponent(bookTitle)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm border-2 border-current px-2 py-1 inline-block hover:bg-current hover:text-crt-bg dark:hover:text-blueprint-bg transition-colors font-bold uppercase"
          >
            Search Goodreads &#8599;
          </a>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <select 
          value={filterType} 
          onChange={e => setFilterType(e.target.value)}
          className="bg-transparent border-2 border-current p-1 uppercase text-sm outline-none font-bold"
        >
          <option value="All" className="bg-blueprint-bg dark:bg-crt-bg text-current">All Types</option>
          <option value="Highlight" className="bg-blueprint-bg dark:bg-crt-bg text-current">Highlights Only</option>
          <option value="Note" className="bg-blueprint-bg dark:bg-crt-bg text-current">Notes Only</option>
        </select>
      </div>

      <div>
        {filteredNotes.map(note => (
          <NoteCard key={note.id} note={note} showMetadata={false} />
        ))}
      </div>

      {filteredNotes.length === 0 && <div className="text-center uppercase tracking-widest opacity-70">No records match the filter.</div>}
    </div>
  );
};

export default BookDetail;
