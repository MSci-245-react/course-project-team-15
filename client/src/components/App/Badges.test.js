import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Badges from './Badges';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useLocation: () => ({
    search: '?userId=123',
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ ReviewCount: 25 }),
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

    expect(fetch).toHaveBeenCalledWith('/api/user/123');


    await screen.findByText('Badge 1');
    await screen.findByText('Badge 2');
    
    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.getByText('Badge 2')).toBeInTheDocument();
    expect(screen.queryByText('Badge 3')).not.toBeInTheDocument();
  });


});
