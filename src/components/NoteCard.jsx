import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return format(d, 'MMM dd, yyyy HH:mm');
  } catch (e) {
    return dateString;
  }
};

const NoteCard = ({ note, showMetadata = true }) => {
  const isMissingMeta = note.author === 'Unknown' || note.book_title === 'Unknown';

  return (
    <div className="border-2 border-current p-4 mb-6 shadow-brutal dark:shadow-none dark:border-crt-text/50 hover:border-current transition-colors bg-white/5 dark:bg-black/50">
      
      {showMetadata && (
        <div className="mb-4 pb-2 border-b-2 border-current/20 flex flex-col sm:flex-row justify-between text-sm opacity-80">
          <div className="flex flex-col">
            <Link 
              to={`/book/${encodeURIComponent(note.book_title)}`} 
              className={`hover:underline font-bold ${note.book_title === 'Unknown' ? 'text-blueprint-accent dark:text-crt-amber' : ''}`}
            >
              {note.book_title}
            </Link>
            <Link 
              to={`/author/${encodeURIComponent(note.author)}`} 
              className={`hover:underline ${note.author === 'Unknown' ? 'text-blueprint-accent dark:text-crt-amber' : ''}`}
            >
              by {note.author}
            </Link>
          </div>
          <div className="text-left sm:text-right mt-2 sm:mt-0">
            <div>{formatDate(note.date_added)}</div>
            <div className="text-xs uppercase">{note.type}</div>
          </div>
        </div>
      )}

      {!showMetadata && (
        <div className="mb-2 text-xs opacity-70 flex justify-between">
          <span>{note.location}</span>
          <span>{formatDate(note.date_added)}</span>
        </div>
      )}

      <div className="mt-2">
        {note.type === 'Note' && note.related_highlight && (
          <blockquote className="border-l-4 border-current pl-4 my-4 italic opacity-80 whitespace-pre-wrap">
            {note.related_highlight}
          </blockquote>
        )}
        
        <p className={`whitespace-pre-wrap ${note.type === 'Note' ? 'font-bold text-lg' : ''}`}>
          {note.content}
        </p>
      </div>

      {isMissingMeta && showMetadata && (
        <div className="mt-4 pt-2 border-t border-dashed border-current/30 text-xs text-blueprint-accent dark:text-crt-amber uppercase">
          Warning: Missing Metadata
        </div>
      )}
    </div>
  );
};

export default NoteCard;
