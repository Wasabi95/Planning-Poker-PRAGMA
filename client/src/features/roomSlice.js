// src/features/roomSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomId: "",
  roomName: "",
  user: {
    name: "",
    role: "player", // default role
  },
  players: [],
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.roomId = action.payload.id;
      state.roomName = action.payload.name;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
  },
});

export const { setRoom, setUser, setPlayers } = roomSlice.actions;
export default roomSlice.reducer;
