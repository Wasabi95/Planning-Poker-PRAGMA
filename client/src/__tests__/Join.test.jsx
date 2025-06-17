// src/__tests__/join.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Join from '../pages/Join';
import '@testing-library/jest-dom';

// Mock socket.io
jest.mock('../socket', () => ({
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn(),
}));

// Mock reducer
const mockRoomSlice = (state = {}, action) => {
  switch (action.type) {
    case 'room/setUser':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

describe('Join Component Validation', () => {
  let store;
  const roomId = 'test-room-123';
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        room: mockRoomSlice,
      },
    });
    window.alert = jest.fn(); // mock alert
  });

  const renderComponent = () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/join/${roomId}`]}>
          <Routes>
            <Route path="/join/:roomId" element={<Join />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('shows alert when name is empty', () => {
    renderComponent();

    const joinButton = screen.getByRole('button', { name: /join room/i });
    fireEvent.click(joinButton);

    expect(window.alert).toHaveBeenCalledWith('Please enter your name');
    expect(window.alert).toHaveBeenCalledTimes(1);

    const { emit } = require('../socket');
    expect(emit).not.toHaveBeenCalled();
  });

  test('shows alert when name is only whitespace', () => {
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/e\.g\. maria/i);
    fireEvent.change(nameInput, { target: { value: '   ' } });

    const joinButton = screen.getByRole('button', { name: /join room/i });
    fireEvent.click(joinButton);

    expect(window.alert).toHaveBeenCalledWith('Please enter your name');
  });

  test('allows join with valid name', () => {
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/e\.g\. maria/i);
    fireEvent.change(nameInput, { target: { value: 'Maria' } });

    const joinButton = screen.getByRole('button', { name: /join room/i });
    fireEvent.click(joinButton);

    expect(window.alert).not.toHaveBeenCalled();

    const { emit } = require('../socket');
    expect(emit).toHaveBeenCalledWith('joinRoom', {
      roomId,
      user: { name: 'Maria', role: 'player' },
    });    
  });
  test('allows user to select role and emits correct data', () => {
  renderComponent();

  // Change role
  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'spectator' } });
  expect(select.value).toBe('spectator');

  // Enter name
  const nameInput = screen.getByPlaceholderText(/e\.g\. maria/i);
  fireEvent.change(nameInput, { target: { value: 'Maria' } });

  // Submit form
  const joinButton = screen.getByRole('button', { name: /join room/i });
  fireEvent.click(joinButton);

  const { emit } = require('../socket');
  expect(emit).toHaveBeenCalledWith('joinRoom', {
    roomId: 'test-room-123',
    user: { name: 'Maria', role: 'spectator' },
  });
});
});



//  Test 1: 'shows alert when name is empty'
////// Checks if the app shows an alert when the user clicks "Join Room" without entering a name.

//  Test 2: 'shows alert when name is only whitespace'
////// Verifies that entering only spaces (e.g., ' ') is treated the same as leaving the input empty.

//  Test 3: 'allows join with valid name'
////// Confirms that if a valid name is entered (e.g., "Maria"), the form works as expected.

//  Test 4: 'allows user to select role and emits correct data'
////// To verify that when the user selects a role (e.g., Spectator) and provides a valid name, 
/////  the joinRoom event is emitted with the correct role and name.