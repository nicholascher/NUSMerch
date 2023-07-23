import React from 'react';
import { vi, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'
import Signout from '../components/Signout';
import Navbar from '../components/Navbar';
import Login from '../components/Login'

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  
  const actual = await vi.importActual('react-router-dom');
  const navigateMock = vi.fn();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }

});

vi.mock('firebase/auth' ,async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    signOut: vi.fn(() => {
      return Promise.resolve({ user: {} });
    })
  }
})


test('should sign out and navigate to "/login" on clicking sign out button', async () => {
  
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  </MemoryRouter>
  );

  // Find and click the sign out button
  const signOutButton = screen.getByRole('button', { name: /sign out/i });
  fireEvent.click(signOutButton);

  expect(signOut).toHaveBeenCalledTimes(1)

  await screen.findByText(/Login/i);
});
