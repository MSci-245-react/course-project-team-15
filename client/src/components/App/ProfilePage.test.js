import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { MemoryRouter } from 'react-router-dom';

describe('ProfilePage Component', () => {
  test('renders user information correctly', () => {
    render(<ProfilePage />, { wrapper: MemoryRouter });

    expect(screen.getByText("User's Name")).toBeInTheDocument();
    expect(screen.getByText("A brief bio about the user.")).toBeInTheDocument();
  });

  test('renders user statistics correctly', () => {
    render(<ProfilePage />, { wrapper: MemoryRouter });

    expect(screen.getByText('Reviews: 2')).toBeInTheDocument();
    expect(screen.getByText('Visited: 0')).toBeInTheDocument();
    expect(screen.getByText('Shortlisted: 0')).toBeInTheDocument();
    expect(screen.getByText('Favourited: 0')).toBeInTheDocument();
    expect(screen.getByText('Friends: 2')).toBeInTheDocument();
  });

  test('navigates to different lists correctly', () => {
    const { getByText } = render(<ProfilePage />, { wrapper: MemoryRouter });

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    fireEvent.click(getByText('My Reviews'));
    expect(mockNavigate).toHaveBeenCalledWith('/ReviewsList');

    fireEvent.click(getByText('Been'));
    expect(mockNavigate).toHaveBeenCalledWith('/BeenToList');

    fireEvent.click(getByText('Shortlist'));
    expect(mockNavigate).toHaveBeenCalledWith('/WantToTryList');

    fireEvent.click(getByText('Favourites'));
    expect(mockNavigate).toHaveBeenCalledWith('/FavouritesList');

    fireEvent.click(getByText('My Friends'));
    expect(mockNavigate).toHaveBeenCalledWith('/friends');
  });
});
