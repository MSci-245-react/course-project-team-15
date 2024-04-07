import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ status: 200 })),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CreateAccount Component', () => {
  beforeEach(() => {
    createUserWithEmailAndPassword.mockClear();
    mockNavigate.mockClear();
  });

  test('input fields update state correctly', () => {
    render(
      <Router>
        <CreateAccount />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'johndoe' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'JohnDoe123' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'johndoe@example.com' },
    });

    expect(screen.getByLabelText('First Name').value).toBe('John');
    expect(screen.getByLabelText('Last Name').value).toBe('Doe');
    expect(screen.getByLabelText('Username').value).toBe('johndoe');
    expect(screen.getByLabelText('Password').value).toBe('JohnDoe123');
    expect(screen.getByLabelText('Email').value).toBe('johndoe@example.com');
  });
});
