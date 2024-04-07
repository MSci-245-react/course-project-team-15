import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FavouritesList from './FavouritesList';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes('/api/restaurants/1')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ Name: 'Restaurant 1', FullAddress: '123 Main St' }),
    });
  } else if (url.includes('/api/restaurants/2')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ Name: 'Restaurant 2', FullAddress: '456 Elm St' }),
    });
  } else {
    return Promise.reject(new Error('Invalid URL'));
  }
});

describe('FavouritesList component', () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });

  test('renders with no favourite restaurants', async () => {
    const { getByText } = render(<FavouritesList />);
    expect(getByText('My Favourite Restaurants')).toBeInTheDocument();
    expect(getByText('No favourite restaurants found.')).toBeInTheDocument();
  });

  test('renders with favourite restaurants and allows deletion', async () => {
    localStorage.setItem('favouriteRestaurants', JSON.stringify([1, 2]));
    const { getByText, queryByText } = render(<FavouritesList />);
    
    expect(getByText('My Favourite Restaurants')).toBeInTheDocument();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
    expect(queryByText('No favourite restaurants found.')).not.toBeInTheDocument();
    expect(getByText('Restaurant 1')).toBeInTheDocument();
    expect(getByText('Restaurant 2')).toBeInTheDocument();
    
    fireEvent.click(getByText('Delete'));
    expect(localStorage.getItem('favouriteRestaurants')).toEqual('[2]');
    expect(queryByText('Restaurant 1')).not.toBeInTheDocument();
    expect(getByText('Restaurant 2')).toBeInTheDocument();
  });
});
