// src/__tests__/Room.test.jsx
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Room from '../pages/Room';
import '@testing-library/jest-dom';

// Mock socket
jest.mock('../socket', () => ({
  on: jest.fn(),
  off: jest.fn(),
}));

import socket from '../socket';

afterEach(cleanup);

const mockInitialState = {
  room: {
    roomName: 'DevTeam',
    user: { name: 'Antonio', role: 'player' },
    players: [
      { id: 1, name: 'Antonio', role: 'player' },
      { id: 2, name: 'Maria', role: 'spectator' },
    ],
  },
};

const mockReducer = (state = mockInitialState.room, action) => {
  switch (action.type) {
    case 'room/setRoom':
      return { ...state, roomName: action.payload.name };
    case 'room/setPlayers':
      return { ...state, players: action.payload };
    default:
      return state;
  }
};

const renderComponent = () => {
  const store = configureStore({
    reducer: {
      room: mockReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/room/test-room-id']}>
        <Routes>
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('Room Component', () => {
  test('renders room and user info correctly', () => {
    renderComponent();

    expect(screen.getByText(/Room:/)).toHaveTextContent('Room: DevTeam');
    expect(screen.getByText(/Welcome,/)).toHaveTextContent('Welcome, Antonio');
    expect(screen.getByText(/Player/)).toBeInTheDocument();
  });

test('renders players with correct roles', () => {
  renderComponent();

  const participantList = screen.getByRole('list');

  expect(within(participantList).getByText('Antonio')).toBeInTheDocument();
  expect(within(participantList).getByText('Maria')).toBeInTheDocument();
  expect(within(participantList).getByText('Player')).toBeInTheDocument();
  expect(within(participantList).getByText('Spectator')).toBeInTheDocument();
});

  test('copies room link and shows alert', () => {
    renderComponent();

    const mockClipboard = jest.fn();
    Object.assign(navigator, {
      clipboard: { writeText: mockClipboard },
    });
    window.alert = jest.fn();

    fireEvent.click(screen.getByRole('button', { name: /copy room link/i }));

    expect(mockClipboard).toHaveBeenCalledWith(
      'http://localhost/join/test-room-id'
    );
    expect(window.alert).toHaveBeenCalledWith('Room link copied to clipboard!');
  });

  test('registers and cleans up socket events', () => {
    const { unmount } = renderComponent();

    expect(socket.on).toHaveBeenCalledWith('updatePlayers', expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith('roomInfo', expect.any(Function));

    unmount();

    expect(socket.off).toHaveBeenCalledWith('updatePlayers');
    expect(socket.off).toHaveBeenCalledWith('roomInfo');
  });
});
