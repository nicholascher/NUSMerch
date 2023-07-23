import React, { useEffect } from 'react';
import { vi, test, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, renderHook } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import FilteredSellers from '../components/FilteredSellers';


// Mock useParams

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual, 
    useParams: vi.fn(() => {
      return { 
        type: 'RC'
      } 
    })
  }
})

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual, 
    useState: vi.fn((init, setInit) => {
      const groups = [
        { type: 'RC', name: 'Ridge View', imagePath: 'groups/Ridge View.jpg', id: 'B4V2u1WvuxyspPmtVDb5' },
        { type: 'RC', name: 'Tembusu', imagePath: 'groups/Tembusu.jpg', id: 'QTc4hY5hoTKhh39NylDM' },
        { type: 'RC', imagePath: 'groups/CAPT.jpg', name: 'CAPT', id: 'fbrgMxciMPSiFeOBLRTh' },
        { type: 'RC', name: 'Cinnamon', imagePath: 'groups/Cinnamon.jpg', id: 'pJqSusdv7C5oVexVHbRt' },
        { type: 'RC', imagePath: 'groups/RC4.jpg', name: 'RC4', id: 'qhz7Gpz6Kj02ZsDg97LB' }
      ];
      return [groups, setInit];
    })
  }
})


describe('FilterSellers', () => {
  
  test('Displays correct sellers', async () => {

    
    render(
      <MemoryRouter initialEntries={[`/filteredsellers/:type`]}>
        <Routes>
          <Route path="/filteredsellers/:type" element={<FilteredSellers />} />
        </Routes>
      </MemoryRouter>
    )


    const groupsExpected = ['RC4', 'Ridge View', 'Tembusu', 'Cinnamon', 'CAPT']

    groupsExpected.forEach((group) => {
      expect(screen.getByText(group)).toBeInTheDocument();
    })


  })
})