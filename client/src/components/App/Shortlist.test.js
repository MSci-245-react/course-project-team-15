import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Shortlist from './Shortlist';
import '@testing-library/jest-dom';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Shortlist component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Assuming an initial empty response
      })
    );
  });

  it('renders Shortlist component with no restaurants', async () => {
    render(
      <Router>
        <Shortlist />
      </Router>
    );
    await waitFor(() => {expect(screen.getByText('Shortlist')).toBeInTheDocument();});
  });

  it('renders Shortlist component with one restaurant', async () => {
    const restaurant = { id: 1, name: 'Test Restaurant' };
    localStorage.setItem('shortlistedRestaurants', JSON.stringify([restaurant.id]));
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Name: restaurant.name }),
    });

    render(
      <Router>
        <Shortlist />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(restaurant.name)).toBeInTheDocument();
    });
  });

  it('deletes a restaurant from the shortlist', async () => {
    const restaurant = { id: 1, name: 'Test Restaurant'};
    localStorage.setItem('shortlistedRestaurants', JSON.stringify([restaurant.id]));
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Name: restaurant.name }),
    });

    render(
      <Router>
        <Shortlist />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(restaurant.name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.queryByText(restaurant.name)).not.toBeInTheDocument();
    });
  });

  it('navigates to restaurant details page when View button is clicked', async () => {
    const restaurant = { id: 1, name: 'Test Restaurant' };
    localStorage.setItem('shortlistedRestaurants', JSON.stringify([restaurant.id]));
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Name: restaurant.name }),
    });

    render(
      <Router>
        <Shortlist />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(restaurant.name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('View'));

    expect(mockedNavigate).toHaveBeenCalledWith(`/restaurant/${restaurant.id}`);
  });
});
