import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ProfilePage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });


  test('renders user information correctly', async () => {
    render(
      <Router>
        <ProfilePage />
      </Router>
      );
    
    expect(screen.getByText("User's Name")).toBeInTheDocument();
    expect(screen.getByText("A brief bio about the user.")).toBeInTheDocument();
  });

  // test('renders user statistics correctly', () => {
  //   render(
  //   <Router>
  //     <ProfilePage />
  //   </Router>);

  //   expect(screen.getByText('Reviews:')).toBeInTheDocument();
  //   expect(screen.getByText('Visited:')).toBeInTheDocument();
  //   expect(screen.getByText('Shortlisted:')).toBeInTheDocument();
  //   expect(screen.getByText('Favourited:')).toBeInTheDocument();
  //   expect(screen.getByText('Friends:')).toBeInTheDocument();
  // });

  test('navigates to different lists correctly', async () => {
    render(
      <Router>
        <ProfilePage/>
        </Router>
      );

    fireEvent.click(screen.getByText('My Reviews'));
    expect(mockNavigate).toHaveBeenCalledWith('/ReviewsList');

    fireEvent.click(screen.getByText('Been'));
    expect(mockNavigate).toHaveBeenCalledWith('/BeenToList');

    fireEvent.click(screen.getByText('Shortlist'));
    expect(mockNavigate).toHaveBeenCalledWith('/Shortlist');

    fireEvent.click(screen.getByText('Favourites'));
    expect(mockNavigate).toHaveBeenCalledWith('/FavouritesList');

    fireEvent.click(screen.getByText('My Friends'));
    expect(mockNavigate).toHaveBeenCalledWith('/friends');
  });
});
