import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import FeedPage from './FeedPage';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify([
    { id: 1, Name: 'Test Restaurant 1', Description: 'A great place', FeaturedImage: 'url/to/image', rating: 4, Categories: 'Italian, Pizza' },
    { id: 2, Name: 'Test Restaurant 2', Description: 'Another great place', FeaturedImage: 'url/to/image2', rating: 3, Categories: 'American, Burger' }
  ]));

  fetch.mockResponseOnce(JSON.stringify([
    { id: 1, userId: 1, reviewTitle: 'Great food', overallRating: 4, reviewContent: 'Lorem ipsum dolor sit amet.' },
    { id: 2, userId: 2, reviewTitle: 'Awesome place', overallRating: 5, reviewContent: 'Consectetur adipiscing elit.' }
  ]));

  fetch.mockResponseOnce(JSON.stringify([
    { id: 1, id: 1 },
    { id: 2, id: 2 }
  ]));
});

describe('FeedPage', () => {
  test('renders feed title', () => {
    render(
      <Router>
        <FeedPage />
      </Router>
    );
    const feedTitle = screen.getByText(/feed/i);
    expect(feedTitle).toBeInTheDocument();
  });

  test('renders rating filter', () => {
    render(
      <Router>
        <FeedPage />
      </Router>
    );
    const ratingFilter = screen.getByPlaceholderText(/rating/i);
    expect(ratingFilter).toBeInTheDocument();
    expect(ratingFilter).toHaveValue('0');
  });

});
