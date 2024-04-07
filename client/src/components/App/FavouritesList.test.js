import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import BeenToList from './FavouritesList';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

  describe('FavouritesList', () => {
    beforeEach(() => {
        mockedNavigate.mockClear();
        localStorage.clear();
        fetch.resetMocks();
    });
  
    it('renders restaurants from local storage', async () => {
      localStorage.setItem('favouriteRestaurants', JSON.stringify(['1', '2']));
      fetch
        .mockResponseOnce(JSON.stringify({ Name: 'Restaurant 1'}))
        .mockResponseOnce(JSON.stringify({ Name: 'Restaurant 2'}));
  
      render(
        <Router>
          <BeenToList />
        </Router>
      );
  
      await waitFor(() => {
        expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
        expect(screen.getByText('Restaurant 2')).toBeInTheDocument();
      });
    });
  
    it('deletes a restaurant from the list', async () => {
      localStorage.setItem('favouriteRestaurants', JSON.stringify(['1']));
      fetch.mockResponseOnce(JSON.stringify({ Name: 'Restaurant 1'}));
  
      render(
        <Router>
          <BeenToList />
        </Router>
      );
  
      await waitFor(() => {userEvent.click(screen.getByText('Delete'));});
      await waitFor(() => expect(screen.queryByText('Restaurant 1')).not.toBeInTheDocument());
    });
  
    it('navigates to restaurant page on "View" click', async () => {
      localStorage.setItem('favouriteRestaurants', JSON.stringify(['1']));
      fetch.mockResponseOnce(JSON.stringify({ Name: 'Restaurant 1'}));
  
      render(
        <Router>
          <BeenToList />
        </Router>
      );

      await waitFor(() => {userEvent.click(screen.getByText('View'));});
      await waitFor(() => {expect(mockedNavigate).toHaveBeenCalledWith('/restaurant/1');});
    });
  });