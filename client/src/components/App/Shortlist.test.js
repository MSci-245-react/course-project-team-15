import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Shortlist from './Shortlist';

describe('Shortlist component', () => {
  beforeEach(() => {
    localStorage.clear(); 
  });

  it('renders Shortlist component with no restaurants', () => {
    render(<Shortlist />);
    expect(screen.getByText('Shortlist')).toBeInTheDocument();
    expect(screen.queryByText('No shortlisted restaurants.')).toBeInTheDocument();
  });

  it('renders Shortlist component with one restaurant', async () => {
    const restaurant = { id: 1, name: 'Test Restaurant', address: 'Test Address' };
    localStorage.setItem('shortlistedRestaurants', JSON.stringify([restaurant.id]));
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => restaurant,
    });

    render(<Shortlist />);

    await waitFor(() => {
      expect(screen.getByText(restaurant.name)).toBeInTheDocument();
    });
  });

  it('deletes a restaurant from the shortlist', async () => {
    const restaurant = { id: 1, name: 'Test Restaurant', address: 'Test Address' };
    localStorage.setItem('shortlistedRestaurants', JSON.stringify([restaurant.id]));
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => restaurant,
    });

    render(<Shortlist />);

    await waitFor(() => {
      expect(screen.getByText(restaurant.name)).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText(restaurant.name)).not.toBeInTheDocument();
  });

  it('navigates to restaurant details page when View button is clicked', async () => {
    const restaurant = { id: 1, name: 'Test Restaurant', address: 'Test Address' };
    localStorage.setItem('shortlistedRestaurants', JSON.stringify([restaurant.id]));
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => restaurant,
    });

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(<Shortlist />);

    await waitFor(() => {
      expect(screen.getByText(restaurant.name)).toBeInTheDocument();
    });

    const viewButton = screen.getByText('View');
    fireEvent.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/restaurant/${restaurant.id}`);
  });
});
