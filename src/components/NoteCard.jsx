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
    <div className="border-2 border-current p-3 sm:p-4 mb-4 sm:mb-6 shadow-brutal dark:shadow-none dark:border-crt-text/50 hover:border-current transition-colors bg-white/5 dark:bg-black/50">
      
      {showMetadata && (
        <div className="mb-2.5 pb-2 border-b border-current/20 flex justify-between items-start gap-2 text-xs sm:text-sm opacity-85">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5 leading-snug">
              <Link 
                to={`/book/${encodeURIComponent(note.book_title)}`} 
                className={`hover:underline font-bold truncate max-w-full ${note.book_title === 'Unknown' ? 'text-blueprint-accent dark:text-crt-amber' : ''}`}
              >
                {note.book_title}
              </Link>
              <span className="opacity-75 text-[11px] sm:text-xs whitespace-nowrap">
                by <Link 
                  to={`/author/${encodeURIComponent(note.author)}`} 
                  className={`hover:underline ${note.author === 'Unknown' ? 'text-blueprint-accent dark:text-crt-amber' : ''}`}
                >
                  {note.author}
                </Link>
              </span>
            </div>
            {locationText && <div className="text-[11px] sm:text-xs opacity-70 mt-0.5">{locationText}</div>}
          </div>

          <div className="flex flex-col items-end shrink-0 gap-0.5 text-right">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={(e) => { e.preventDefault(); toggleFavorite(note.id); }}
                className="hover:opacity-80 transition-opacity p-0.5"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star size={14} className={`sm:w-4 sm:h-4 ${isFavorite ? "fill-blueprint-text dark:fill-crt-text text-blueprint-text dark:text-crt-text" : "text-blueprint-text dark:text-crt-text"} shrink-0`} />
              </button>
              <span className="text-[11px] sm:text-xs uppercase font-bold text-blueprint-accent dark:text-crt-amber">{note.type}</span>
            </div>
            <div className="text-[11px] sm:text-xs opacity-70 whitespace-nowrap">{formatDate(note.date_added)}</div>
          </div>
        </div>
      )}

      {!showMetadata && (
        <div className="mb-2.5 pb-2 border-b border-current/20 flex justify-between items-center text-xs sm:text-sm opacity-85 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <button 
              onClick={(e) => { e.preventDefault(); toggleFavorite(note.id); }}
              className="hover:opacity-80 transition-opacity p-0.5"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={14} className={`sm:w-4 sm:h-4 ${isFavorite ? "fill-blueprint-accent dark:fill-crt-amber text-blueprint-accent dark:text-crt-amber" : "text-blueprint-accent dark:text-crt-amber"} shrink-0`} />
            </button>
            <span className="font-bold uppercase tracking-wider text-[11px] sm:text-xs text-blueprint-accent dark:text-crt-amber">{note.type}</span>
            {locationText && (
              <>
                <span className="opacity-50">•</span>
                <span className="text-[11px] sm:text-xs opacity-75">{locationText}</span>
              </>
            )}
          </div>
          <div className="text-right text-[11px] sm:text-xs opacity-70 whitespace-nowrap shrink-0">
            {formatDate(note.date_added)}
          </div>
        </div>
      )}

      <div className="mt-2">
        {note.type === 'Highlight' && (
          <div className="relative">
            <p className="whitespace-pre-wrap pr-10 text-sm sm:text-base">
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
          <div className="relative my-3 sm:my-4">
            <blockquote className="border-l-4 border-current pl-3 sm:pl-4 italic opacity-80 whitespace-pre-wrap pr-16 text-xs sm:text-sm">
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
                tooltipLabel="Copy Both Note and Highlight" 
                icon={<FileText size={14} />} 
              />
            </div>
          </div>
        )}
        
        {note.type === 'Note' && (
          <p className="whitespace-pre-wrap font-bold text-base sm:text-lg">
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
