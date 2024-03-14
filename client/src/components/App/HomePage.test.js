import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => {
  fetch.resetMocks(); 
  fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'Test Restaurant 1', description: 'A great place', FeaturedImage: 'url/to/image', rating: 4, Price: '$', Categories: 'Italian, Pizza'}]));
});

describe('HomePage', () => {
  test('renders search input', () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );
    const searchInput = screen.getByLabelText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });


  test('renders cuisine filters', () => {
    render(
        <Router>
          <HomePage />
        </Router>
      );
    const americanCheckbox = screen.getByLabelText(/american/i);
    const italianCheckbox = screen.getByLabelText(/italian/i);
    const asianCheckbox = screen.getByLabelText(/asian/i);
    expect(americanCheckbox).toBeInTheDocument();
    expect(italianCheckbox).toBeInTheDocument();
    expect(asianCheckbox).toBeInTheDocument();
  });

  test('renders price filters', () => {
    render(
        <Router>
          <HomePage />
        </Router>
      );
    const lowCheckbox = screen.getByRole('checkbox', { name: "$" });
    const mediumCheckbox = screen.getByRole('checkbox', { name: "$$" });
    const highCheckbox = screen.getByRole('checkbox', { name: "$$$" });
    expect(lowCheckbox).toBeInTheDocument();
    expect(mediumCheckbox).toBeInTheDocument();
    expect(highCheckbox).toBeInTheDocument();
  });

  test('renders dietary filters', () => {
    render(
        <Router>
          <HomePage />
        </Router>
      );
    const vegetarianCheckbox = screen.getByLabelText(/vegetarian/i);
    const veganCheckbox = screen.getByLabelText(/vegan/i);
    const glutenFreeCheckbox = screen.getByLabelText(/gluten-free/i);
    expect(vegetarianCheckbox).toBeInTheDocument();
    expect(veganCheckbox).toBeInTheDocument();
    expect(glutenFreeCheckbox).toBeInTheDocument();
  });

  test('renders meal times filters', () => {
    render(
        <Router>
          <HomePage />
        </Router>
      );
    const breakfastCheckbox = screen.getByLabelText(/breakfast/i);
    const brunchCheckbox = screen.getByLabelText(/brunch/i);
    const lunchCheckbox = screen.getByLabelText(/lunch/i);
    const dinnerCheckbox = screen.getByLabelText(/dinner/i);
    expect(breakfastCheckbox).toBeInTheDocument();
    expect(brunchCheckbox).toBeInTheDocument();
    expect(lunchCheckbox).toBeInTheDocument();
    expect(dinnerCheckbox).toBeInTheDocument();
  });

  test('renders rating filter', () => {
    render(
        <Router>
          <HomePage />
        </Router>
      );
    const ratingLabel = screen.getByText(/rating/i);
    const ratingStars = screen.getAllByRole('radio');
    expect(ratingLabel).toBeInTheDocument();
    expect(ratingStars).toHaveLength(6); 
  });

  test('navigates to map page on "View Map" button click', () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );
    const mapButton = screen.getByRole('button', { name: /View Map/i });
    expect(mapButton).toBeInTheDocument();
  });

  test('displays restaurants matching the search term', async () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );

    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    const displayedRestaurant = await screen.findByText('Test Restaurant 1');
    expect(displayedRestaurant).toBeInTheDocument();
  });
});
