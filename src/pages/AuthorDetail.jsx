import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';

const AuthorDetail = () => {
  const { authorName } = useParams();
  const { notes, isLoading } = useNotes();

  const authorNotes = useMemo(() => {
    return notes.filter(n => n.author === authorName);
  }, [notes, authorName]);

  const books = useMemo(() => {
    const grouped = authorNotes.reduce((acc, note) => {
      if (!acc[note.book_title]) acc[note.book_title] = [];
      acc[note.book_title].push(note);
      return acc;
    }, {});
    
    Object.keys(grouped).forEach(bookTitle => {
      grouped[bookTitle].sort((a, b) => {
        const locA = parseInt(a.location.match(/\d+/)?.[0] || '0');
        const locB = parseInt(b.location.match(/\d+/)?.[0] || '0');
        return locA - locB;
      });
    });

    return grouped;
  }, [authorNotes]);

  if (isLoading) return <div className="text-center animate-pulse mt-20 font-bold uppercase tracking-widest text-2xl">Loading Data...</div>;

  return (
    <div>
      <div className="mb-8 border-b-4 border-current pb-4">
        <Link to="/" className="text-sm mb-4 inline-block hover:underline font-bold uppercase tracking-wider text-blueprint-accent dark:text-crt-amber">&lt; Return to Dashboard</Link>
        <h1 className="text-3xl font-bold uppercase mb-2">Author: {authorName}</h1>
        <a 
          href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(authorName)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm border-2 border-current px-2 py-1 inline-block hover:bg-current hover:text-crt-bg dark:hover:text-blueprint-bg transition-colors font-bold uppercase"
        >
          Search on Wikipedia &#8599;
        </a>
      </div>

      {Object.entries(books).map(([bookTitle, bNotes]) => (
        <div key={bookTitle} className="mb-12 pl-4 border-l-4 border-current/30">
          <h2 className="text-xl font-bold mb-4 opacity-90">{bookTitle}</h2>
          {bNotes.map(note => (
            <NoteCard key={note.id} note={note} showMetadata={false} />
          ))}
        </div>
      ))}

      {authorNotes.length === 0 && <div className="text-center uppercase tracking-widest opacity-70">No records found for this author.</div>}
    </div>
  );
};

export default AuthorDetail;
