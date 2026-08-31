import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Copy, Check, Quote, FileText, Star } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

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

const cleanLocation = (loc) => {
  if (!loc) return '';
  const text = loc.replace(/\|\s*Added on.*/i, '').trim();
  const pageMatch = text.match(/page\s*\d+(\s*-\s*\d+)?/i);
  if (pageMatch) {
    return pageMatch[0];
  }
  return text;
};

const getMarkdownContent = (highlight, noteContent) => {
  if (!highlight) return noteContent || '';
  const formattedHighlight = highlight
    .split('\n')
    .map(line => `> ${line}`)
    .join('\n');
  return noteContent ? `${formattedHighlight}\n\n${noteContent}` : formattedHighlight;
};

const CopyButton = ({ text, tooltipLabel = 'Copy Highlight', icon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group inline-block">
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-blueprint-text hover:text-blueprint-bg dark:hover:bg-crt-text dark:hover:text-crt-bg transition-colors flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100"
        aria-label={tooltipLabel}
      >
        {copied ? <Check size={14} /> : (icon || <Copy size={14} />)}
      </button>
      <div className={`absolute right-0 top-full mt-1 bg-blueprint-text text-blueprint-bg dark:bg-crt-text dark:text-crt-bg text-xs px-2 py-1 border border-current font-bold uppercase whitespace-nowrap z-20 pointer-events-none shadow-sm ${copied ? 'block' : 'hidden group-hover:block'}`}>
        {copied ? 'Copied!' : tooltipLabel}
      </div>
    </div>
  );
};

const NoteCard = ({ note, showMetadata = true }) => {
  const { favorites, toggleFavorite } = useNotes();
  const isFavorite = favorites.includes(note.id);
  const isMissingMeta = note.author === 'Unknown' || note.book_title === 'Unknown';
  const locationText = cleanLocation(note.location);

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
            {locationText && <span className="text-xs opacity-70 mt-1">{locationText}</span>}
          </div>
          <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0 gap-1">
            <div>{formatDate(note.date_added)}</div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={(e) => { e.preventDefault(); toggleFavorite(note.id); }}
                className="hover:opacity-80 transition-opacity"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star size={16} className={isFavorite ? "fill-blueprint-text dark:fill-crt-text text-blueprint-text dark:text-crt-text" : "text-blueprint-text dark:text-crt-text"} />
              </button>
              {note.language && (
                <span className="text-xs px-1 border border-current font-bold uppercase opacity-75">
                  {note.language}
                </span>
              )}
              <span className="text-xs uppercase font-bold text-blueprint-accent dark:text-crt-amber">{note.type}</span>
            </div>
          </div>
        </div>
      )}

      {!showMetadata && (
        <div className="mb-4 pb-2 border-b-2 border-current/20 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm opacity-80 gap-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.preventDefault(); toggleFavorite(note.id); }}
              className="hover:opacity-80 transition-opacity"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={16} className={isFavorite ? "fill-blueprint-accent dark:fill-crt-amber text-blueprint-accent dark:text-crt-amber" : "text-blueprint-accent dark:text-crt-amber"} />
            </button>
            <span className="font-bold uppercase tracking-wider text-blueprint-accent dark:text-crt-amber">{note.type}</span>
            {note.language && (
              <>
                <span>•</span>
                <span className="font-bold uppercase opacity-75">{note.language}</span>
              </>
            )}
            {locationText && (
              <>
                <span>•</span>
                <span>{locationText}</span>
              </>
            )}
          </div>
          <div className="text-left sm:text-right mt-1 sm:mt-0">
            <div>{formatDate(note.date_added)}</div>
          </div>
        </div>
      )}

      <div className="mt-2">
        {note.type === 'Highlight' && (
          <div className="relative">
            <p className="whitespace-pre-wrap pr-10">
              {note.content}
            </p>
            <div className="absolute top-0 right-0">
              <CopyButton 
                text={note.content} 
                tooltipLabel="Copy Highlight" 
                icon={<Quote size={14} />} 
              />
            </div>
          </div>
        )}

        {note.type === 'Note' && note.related_highlight && (
          <div className="relative my-4">
            <blockquote className="border-l-4 border-current pl-4 italic opacity-80 whitespace-pre-wrap pr-16">
              {note.related_highlight}
            </blockquote>
            <div className="absolute top-0 right-0 flex items-center gap-1">
              <CopyButton 
                text={note.related_highlight} 
                tooltipLabel="Copy Highlight Only" 
                icon={<Quote size={14} />} 
              />
              <CopyButton 
                text={getMarkdownContent(note.related_highlight, note.content)} 
                tooltipLabel="Copy Both (Markdown)" 
                icon={<FileText size={14} />} 
              />
            </div>
          </div>
        )}
        
        {note.type === 'Note' && (
          <p className="whitespace-pre-wrap font-bold text-lg">
            {note.content}
          </p>
        )}
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
