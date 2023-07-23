import React from 'react';
import { vi, describe, test, resetAllMocks, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Login from '../components/Login';
import LandingPage from '../components/LandingPage';

const signInWithEmailAndPasswordMockSuccess = vi.fn().mockImplementation((authObj, email, password) => {
  expect(email).toBe('testing123@gmail.com');
  expect(password).toBe('Asdasd123123!');
  return Promise.resolve({ user: {} });
});

const signInWithEmailAndPasswordMockError = vi.fn().mockRejectedValue({ code: 'auth/wrong-password', message: 'Incorrect password' });

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn((authObj, email, password) => {
      if (email === 'testing123@gmail.com' && password === 'Asdasd123123!') {
        return signInWithEmailAndPasswordMockSuccess(authObj, email, password);
      } else {
        return signInWithEmailAndPasswordMockError(authObj, email, password);
      }
    }),
  };
});

describe('Login success', () => {
  test('renders login form and handles form submission', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/landingpage" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();

    await fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'testing123@gmail.com' },
    });
    await fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Asdasd123123!' },
    });

    await fireEvent.click(screen.getByText(/Login/i));

    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);

    await screen.findByText(/All Sellers/i);

    expect(screen.getByText(/All Sellers/i)).toBeInTheDocument();
  });

  test('renders login form and handles form submission with invalid credentials', async () => {
    const { container, history } = render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/landingpage" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();

    await fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'invalid@gmail.com' },
    });
    await fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Asdasd123123!' },
    });

    fireEvent.click(screen.getByText(/Login/i));

    await screen.findByText(/Incorrect password/i);

    expect(screen.getByText(/Incorrect password/i)).toBeInTheDocument();
  });
});
