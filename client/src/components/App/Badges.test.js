import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Badges from './Badges';
import { useLocation } from 'react-router-dom';

// Mock useLocation to return a specific search string
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use actual for all non-overridden methods
  useLocation: () => ({
    search: '?userId=123',
  }),
}));

// Mock global.fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ ReviewCount: 25 }), // Adjust this value based on test needs
  })
);

describe('Badges Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches review count correctly and displays badges', async () => {
    render(
      <Router>
        <Badges />
      </Router>
    );

    // Expect fetch to have been called with the correct URL
    expect(fetch).toHaveBeenCalledWith('/api/user/123');

    // Wait for the component to update based on the mock fetch
    await screen.findByText('Badge 1');
    await screen.findByText('Badge 2');
    
    // Verify that badges are displayed based on the mock ReviewCount
    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.getByText('Badge 2')).toBeInTheDocument();
    expect(screen.queryByText('Badge 3')).not.toBeInTheDocument(); // Based on ReviewCount = 25, Badge 3 should not exist
  });


});
