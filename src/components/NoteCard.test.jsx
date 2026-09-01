import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import NoteCard from './NoteCard';
import * as NotesContextModule from '../context/NotesContext';

// Mock the context hook
vi.mock('../context/NotesContext', () => ({
  useNotes: vi.fn(),
}));

const renderNoteCard = (note) => {
  vi.mocked(NotesContextModule.useNotes).mockReturnValue({
    favorites: [],
    toggleFavorite: vi.fn(),
  });

  return render(
    <MemoryRouter>
      <NoteCard note={note} />
    </MemoryRouter>
  );
};

describe('NoteCard edge cases and sanity checks', () => {
  it('shows missing metadata warning when author is empty string', () => {
    const note = { 
      id: '1', type: 'Note', content: 'Test', 
      book_title: 'Valid Book', author: '' 
    };
    renderNoteCard(note);
    expect(screen.getByText(/Warning: Missing Metadata/i)).toBeInTheDocument();
  });

  it('shows missing metadata warning when book_title is undefined', () => {
    const note = { 
      id: '2', type: 'Note', content: 'Test', 
      book_title: undefined, author: 'Valid Author' 
    };
    renderNoteCard(note);
    expect(screen.getByText(/Warning: Missing Metadata/i)).toBeInTheDocument();
  });

  it('cleans up location strings correctly by removing "Added on" text', () => {
    const note = {
      id: '3', type: 'Highlight', content: 'Test',
      book_title: 'Book', author: 'Author',
      location: 'Highlight on page 12 | Added on Sunday, October 1'
    };
    renderNoteCard(note);
    // NoteCard should only render "page 12" based on its logic
    expect(screen.getByText('page 12')).toBeInTheDocument();
    expect(screen.queryByText(/Added on/i)).not.toBeInTheDocument();
  });

  it('handles invalid dates gracefully by showing "Unknown Date"', () => {
    const note = {
      id: '4', type: 'Highlight', content: 'Test',
      book_title: 'Book', author: 'Author',
      date_added: 'invalid-date-string'
    };
    renderNoteCard(note);
    // Currently, NoteCard falls back to returning the raw string 'invalid-date-string'
    // We want it to be rigorous and show 'Unknown Date'
    expect(screen.getByText('Unknown Date')).toBeInTheDocument();
  });
});

