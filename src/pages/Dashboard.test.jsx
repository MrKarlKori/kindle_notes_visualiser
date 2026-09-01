import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import * as NotesContextModule from '../context/NotesContext';

vi.mock('../context/NotesContext', () => ({
  useNotes: vi.fn(),
}));

const mockNotes = [
  { id: '1', type: 'Highlight', content: 'React is awesome', book_title: 'Book A', author: 'Author A', language: 'English' },
  { id: '2', type: 'Note', content: 'Need to learn testing', book_title: 'Book B', author: 'Author B', language: 'Spanish' },
];

const renderDashboard = (contextOverrides = {}) => {
  const defaultContext = {
    notes: mockNotes,
    isLoading: false,
    activeTab: 'all',
    setActiveTab: vi.fn(),
    filterType: 'All',
    setFilterType: vi.fn(),
    filterLanguage: 'All',
    setFilterLanguage: vi.fn(),
    filterFavorite: 'All',
    setFilterFavorite: vi.fn(),
    availableLanguages: ['English', 'Spanish'],
    favorites: [],
    ...contextOverrides
  };

  vi.mocked(NotesContextModule.useNotes).mockReturnValue(defaultContext);

  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

describe('Dashboard rigorous tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and filters notes by content', () => {
    renderDashboard();
    
    // We expect a search input to exist for better UX
    const searchInput = screen.getByPlaceholderText(/search notes/i);
    expect(searchInput).toBeInTheDocument();

    // Both notes should be visible initially
    expect(screen.getByText(/React is awesome/i)).toBeInTheDocument();
    expect(screen.getByText(/Need to learn testing/i)).toBeInTheDocument();

    // Type into search
    fireEvent.change(searchInput, { target: { value: 'React' } });

    // Should only show the first note
    expect(screen.getByText(/React is awesome/i)).toBeInTheDocument();
    expect(screen.queryByText(/Need to learn testing/i)).not.toBeInTheDocument();
  });

  it('shows a "Clear Filters" button when any filter is active', () => {
    // Render with filterLanguage set to 'Spanish'
    renderDashboard({ filterLanguage: 'Spanish' });
    
    // Expect a clear filters button to appear
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).toBeInTheDocument();
  });
});

