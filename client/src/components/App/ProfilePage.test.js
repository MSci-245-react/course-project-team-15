import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => ({
      currentUser: {
        uid: 'znGHn6ow4chnQDJSeHaqgywKAyw1'
      }
    }))
  };
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      user: {
        firstName: 'someFirstName',
        lastName: 'someLastName',
        email: 'some.email@example.com',
      },
    }),
  })
);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


describe('ProfilePage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders user information correctly with test props', () => {
    const testInitialState = {
      userName: "Micheal Scott",
      email: "micheal.scott@gmail.com",
    };

    render(
      <Router>
        <ProfilePage testInitialState={testInitialState} />
      </Router>
    );
    expect(screen.getByText("No bio available.")).toBeInTheDocument();
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
  // });

  // test('navigates to different lists correctly', async () => {
  //   render(
  //     <Router>
  //       <ProfilePage/>
  //       </Router>
  //     );

  //   fireEvent.click(screen.getByText('My Reviews'));
  //   expect(mockNavigate).toHaveBeenCalledWith('/ReviewsList');

  //   fireEvent.click(screen.getByText('Been'));
  //   expect(mockNavigate).toHaveBeenCalledWith('/BeenToList');

  //   fireEvent.click(screen.getByText('Shortlist'));
  //   expect(mockNavigate).toHaveBeenCalledWith('/Shortlist');

  //   fireEvent.click(screen.getByText('Favourites'));
  //   expect(mockNavigate).toHaveBeenCalledWith('/FavouritesList');
  // });
  afterAll(() => {
    global.fetch.mockRestore();
  });
});
