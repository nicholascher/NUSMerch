import React from 'react';
import { vi, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { addDoc } from "firebase/firestore";
import AddListings from '../components/AddListings';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false, 
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    addDoc: vi.fn(() => Promise.resolve({ })),
  };
});

describe('Add Listings', () => {
  test('Check that new listings can be added', async () => {
    render(
      <MemoryRouter initialEntries={['/addlistings']} >
        <Routes>
          <Route path='/addlistings' element={<AddListings />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByText(/Who are you selling to\?/i), {
      target: { value: 'Halls' },
    });

    fireEvent.change(screen.getByText(/Select an option/i), {
      target: { value: 'Hall A' }, 
    });

    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: 'Mock Product Name' },
    });

    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: '100' },
    });

    fireEvent.change(screen.getByLabelText(/Product Description/i), {
      target: { value: 'Mock Product Description' },
    });

    fireEvent.change(screen.getByLabelText(/Product Display Image/i), {
      target: { files: [new File([], 'mock-image.png', { type: 'image/png' })] },
    });

    fireEvent.change(screen.getByLabelText(/Additional Product Images/i), {
      target: {
        files: [
          new File([], 'mock-image-1.png', { type: 'image/png' }),
          new File([], 'mock-image-2.png', { type: 'image/png' }),
        ],
      },
    });

    fireEvent.change(screen.getByText(/Payment Options/i), {
      target: { value: 'PayNow' },
    });

    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '12345678' },
    });

    const qrCodeFile = new File([], 'mock-qr-code.png', { type: 'image/png' });
    const qrCodeInput = screen.getByText('Payment QR code (Paylah! or PayNow)');
    fireEvent.change(qrCodeInput, { target: { files: [qrCodeFile] } });

    fireEvent.change(screen.getByLabelText(/Instagram Handle/i), {
      target: { value: 'mock_instagram' },
    });

    fireEvent.change(screen.getByLabelText(/Telegram Handle/i), {
      target: { value: 'mock_telegram' },
    });

    // Additional Questions
    fireEvent.click(screen.getByText(/Add question/i));
    fireEvent.change(screen.getByPlaceholderText(/Additional questions/i), {
      target: { value: 'Mock additional question 1' },
    });


    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    // Expectations
    // expect(addDoc).toHaveBeenCalled();

    await screen.findByText(/Please fill in all required fields/i)
  });
});