import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Survey from './Survey';


describe('Survey Component', () => {
  test('calls submit when submit button is clicked', async () => {
    render(
      <Router>
        <Survey />
      </Router>
    );

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Cuisine' }));
    fireEvent.click(screen.getByText('Italian'));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Dietary' }));
    fireEvent.click(screen.getByText('Vegan'));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Meal Preferences' }));
    fireEvent.click(screen.getByText('Lunch'));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Ambiance Preferences' }));
    fireEvent.click(screen.getByText('Cafe'));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Dining Frequency' }));
    fireEvent.click(screen.getByText('Once a week'));

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  });
});
