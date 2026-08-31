import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { NotesProvider } from './context/NotesContext';
import App from './App';

describe('Sanity & Environment Tests', () => {
  it('runs a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('renders a React component and verifies DOM matchers', () => {
    render(<div data-testid="test-element">Vitest is working!</div>);
    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Vitest is working!');
  });

  it('renders the App component inside NotesProvider', () => {
    render(
      <NotesProvider>
        <App />
      </NotesProvider>
    );
  });
});
