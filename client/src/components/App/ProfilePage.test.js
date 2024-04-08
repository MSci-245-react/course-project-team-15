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
  afterAll(() => {
    global.fetch.mockRestore();
  });
});
