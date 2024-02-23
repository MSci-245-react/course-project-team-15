import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';
import '@testing-library/jest-dom';


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
    const lowCheckbox = screen.getByLabelText(/low/i);
    const mediumCheckbox = screen.getByLabelText(/medium/i);
    const highCheckbox = screen.getByLabelText(/high/i);
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
    const vegetarianCheckbox = screen.getByLabelText(/vegetarian friendly/i);
    const veganCheckbox = screen.getByLabelText(/vegan options/i);
    const glutenFreeCheckbox = screen.getByLabelText(/gluten-free options/i);
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

  test('renders apply filters button', () => {
    render(
        <Router>
          <HomePage />
        </Router>
      );
    const applyFiltersButton = screen.getByRole('button', { name: /apply filters/i });
    expect(applyFiltersButton).toBeInTheDocument();
  });
});
