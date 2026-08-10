import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const { notes, isLoading, activeTab, setActiveTab } = useNotes();
  const [sortOrder, setSortOrder] = useState('date-desc');

  const tabs = [
    { id: 'all', label: 'See All' },
    { id: 'authors', label: 'Authors' },
    { id: 'books', label: 'Books' }
  ];

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (sortOrder === 'title-asc') {
        return a.book_title.localeCompare(b.book_title);
      }
      const dateA = new Date(a.date_added).getTime() || 0;
      const dateB = new Date(b.date_added).getTime() || 0;
      return sortOrder === 'date-desc' ? dateB - dateA : dateA - dateB;
    });
  }, [notes, sortOrder]);

  const authors = useMemo(() => {
    const counts = notes.reduce((acc, note) => {
      acc[note.author] = (acc[note.author] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  const books = useMemo(() => {
    const counts = notes.reduce((acc, note) => {
      acc[note.book_title] = (acc[note.book_title] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  if (isLoading) return <div className="text-center animate-pulse mt-20 font-bold uppercase tracking-widest text-2xl">Loading Data...</div>;

  return (
    <div>
      <div className="flex border-b-2 border-current mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 uppercase font-bold border-2 border-transparent border-b-0 ${
              activeTab === tab.id 
                ? 'bg-current text-crt-bg dark:text-blueprint-bg' 
                : 'hover:bg-current/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'all' && (
        <div>
          <div className="flex justify-end mb-4">
            <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)}
              className="bg-transparent border-2 border-current p-1 uppercase text-sm outline-none font-bold"
            >
              <option value="date-desc" className="bg-blueprint-bg dark:bg-crt-bg text-current">Newest First</option>
              <option value="date-asc" className="bg-blueprint-bg dark:bg-crt-bg text-current">Oldest First</option>
              <option value="title-asc" className="bg-blueprint-bg dark:bg-crt-bg text-current">Title A-Z</option>
            </select>
          </div>
          {sortedNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
          {sortedNotes.length === 0 && <div className="text-center mt-10 uppercase tracking-widest opacity-70">No records found.</div>}
        </div>
      )}

      {activeTab === 'authors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {authors.map(([author, count]) => (
            <Link 
              key={author} 
              to={`/author/${encodeURIComponent(author)}`}
              className="border-2 border-current p-4 hover:bg-current hover:text-crt-bg dark:hover:text-blueprint-bg transition-colors flex justify-between items-center group bg-white/5 dark:bg-black/50"
            >
              <span className="font-bold truncate mr-2" title={author}>{author}</span>
              <span className="text-sm px-2 py-1 border border-current group-hover:border-transparent font-bold">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'books' && (
        <div className="flex flex-col gap-4">
          {books.map(([book, count]) => (
            <Link 
              key={book} 
              to={`/book/${encodeURIComponent(book)}`}
              className="border-2 border-current p-4 hover:bg-current hover:text-crt-bg dark:hover:text-blueprint-bg transition-colors flex justify-between items-center group bg-white/5 dark:bg-black/50"
            >
              <span className="font-bold truncate mr-4" title={book}>{book}</span>
              <span className="text-sm px-2 py-1 border border-current group-hover:border-transparent whitespace-nowrap font-bold uppercase">
                {count} entries
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
