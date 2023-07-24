import React from 'react';
import { vi, describe, test} from 'vitest';
import { render, getByAltText, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL } from 'firebase/storage';
import Navbar from '../components/Navbar';
import SellerCheck from '../components/SellerCheck';
import Signout from '../components/Signout';

const mockUser = {
  email: 'testing123@gmail.com',
  profilePic: 'mock-profile-pic-file-path',
};

const mockDownloadURL = '/Images/Profile Default.png';

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(mockUser);
      return () => {}; 
    }),
  };
});

vi.mock('firebase/storage', async () => {
  const actual = await vi.importActual('firebase/storage');
  return {
    ...actual,
    getDownloadURL: vi.fn((ref) => {
      expect(ref).toBe(mockUser.profilePic); 
      return Promise.resolve(mockDownloadURL);
    }),
  };

});

vi.mock('../components/SellerCheck', async (importOriginal) => {
  const mod = await importOriginal();

  return {
    ...mod,
    default: vi.fn(() => {
    }),
  };
});

vi.mock('../components/Signout', async (importOriginal) => {
  const mod = await importOriginal();

  return {
    ...mod,
    default: vi.fn(() => {
    }),
  };
});


describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  test('should navigate to the correct pages', () => {
    const { getByText, getByRole } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const logoLink = getByRole('link', { name: /Logo/i });
    expect(logoLink.getAttribute('href')).toBe('/landingpage');

    const hallsLink = getByText(/Halls/i);
    expect(hallsLink.getAttribute('href')).toBe('/filteredsellers/Hall');

    const rcLink = getByText(/RC/i);
    expect(rcLink.getAttribute('href')).toBe('/filteredsellers/RC');

    const clubsLink = getByText(/Clubs/i);
    expect(clubsLink.getAttribute('href')).toBe('/filteredsellers/Club');

    const messagesButton = getByText(/Messages/i);
    expect(messagesButton.getAttribute('href')).toBe('/chatwindow');
  });

  test('should show default profile pic', async () => {
    const { getByAltText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const profilePic = await getByAltText('profile');
    expect(profilePic.getAttribute('src')).toBe(mockDownloadURL);
  });

  test('should call SellerCheck on Seller Center button click', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const sellerCenterButton = screen.getByText(/Seller Center/i);
    fireEvent.click(sellerCenterButton);

    expect(SellerCheck).toHaveBeenCalled();
  });

  test('should call Signout on Sign Out button click', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const signOutButton = screen.getByText(/Sign Out/i);
    fireEvent.click(signOutButton);

    expect(Signout).toHaveBeenCalled();
  });


});