import React from 'react';
import { vi, test, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDisplay from '../components/ProductDisplay';
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import Purchasing from '../components/Purchasing';



vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual, 
    useLocation: () => {
      const mockSeller = {
        id: '1', 
        name: 'Mock Seller',
        price: 10,
        description: 'This is a mock seller description.',
        imagePath: 'mock/image/path.jpg',
        additionalPaths: ['additional/image/path1.jpg', 'additional/image/path2.jpg'],
        instagram: 'mock_instagram',
        telegram: 'mock_telegram',
        createdBy: 'mock_seller_creator_id',
        phoneNumber: '111',
        questions: ['test 1', 'test 2', 'test 3']
      };
      return {
        state: mockSeller
      }
    }
  }
})

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    addDoc: vi.fn(() => Promise.resolve({
      docs: [
      { id: 'reviewId1', data: () => ({ createdBy: '', rating: 0, review: 'Great product!' }) },
      ]
    })),
    getDoc: vi.fn(() => Promise.resolve({data: () => ({ name: 'John', basket: [] })})),
    getDocs: vi.fn(() => Promise.resolve({
      docs: [
      { id: 'reviewId1', data: () => ({ createdBy: '', rating: 0, review: 'Great product!' }) },
      ]
    }))
  }
})


vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual, 
    onAuthStateChanged: vi.fn((auth, callback) => {
      const user = { email: 'user@example.com'};
      callback(user);
      return () => {};

    })
  }
})




describe('ProductDisplay', () => {
  beforeEach(() => {
  });

  test('should add a new review when "Save Review" button is clicked', async () => {


    const { getByText } = render(
      <MemoryRouter initialEntries={[`/productdisplay/:id`]}>
        <Routes>
          <Route path="/productdisplay/:id" element={<ProductDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    const reviewTextArea = screen.getByLabelText(/Leave a Review!/i);
    fireEvent.change(reviewTextArea, { target: { value: 'Great product!' } });

    const saveReviewButton = screen.getByRole('button', { name: 'Save Review' });
    fireEvent.click(saveReviewButton);

    expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          createdBy: 'user@example.com',
          rating: 0,
          review: 'Great product!',
        }),
    );
  });

  test('Ensure that users are navigated to the correct purchasing page', async () => {
    render(
      <MemoryRouter initialEntries={[`/productdisplay/:id`]}>
        <Routes>
          <Route path="/productdisplay/:id" element={<ProductDisplay />} />
          <Route path="/purchasing/:id" element={<Purchasing />} />
        </Routes>
      </MemoryRouter>
    );
    
    const buyNowButton = screen.getByRole('link', { name: 'Buy Now!' });
    expect(buyNowButton.getAttribute('href')).toBe('/purchasing/1');

  })

  

});
