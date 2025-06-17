// ////src/features/roomSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   roomId: "",
//   roomName: "",
//   user: {
//     name: "",
//     role: "player", // default role
//   },
//   players: [],
// };

// const roomSlice = createSlice({
//   name: "room",
//   initialState,
//   reducers: {
//     setRoom: (state, action) => {
//       state.roomId = action.payload.id;
//       state.roomName = action.payload.name;
//     },
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//     setPlayers: (state, action) => {
//       state.players = action.payload;
//     },
//   },
// });

// export const { setRoom, setUser, setPlayers } = roomSlice.actions;
// export default roomSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid"; // Add this import

const initialState = {
  roomId: "",
  roomName: "",
  user: {
    id: "", 
    name: "",
    role: "player",
  },
  players: [],
  currentStory: {
    id: "",
    title: "",
    description: "",
  },
  votes: {},
  voteStatus: "hidden",
  stories: [],
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
      state.user = {
        ...action.payload,
        id: nanoid(), // Now properly imported
      };
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
      state.votes = {};
      state.voteStatus = "voting";
    },
    submitVote: (state, action) => {
      const { userId, vote } = action.payload;
      state.votes[userId] = vote;
    },
    revealVotes: (state) => {
      state.voteStatus = "revealed";
    },
    resetVotes: (state) => {
      state.votes = {};
      state.voteStatus = "voting";
    },
    addStory: (state, action) => {
      state.stories.push({
        ...action.payload,
        id: nanoid(), // Also fixed here
      });
    },
    setStories: (state, action) => {
      state.stories = action.payload;
    },
  },
});

export const { 
  setRoom, 
  setUser, 
  setPlayers,
  setCurrentStory,
  submitVote,
  revealVotes,
  resetVotes,
  addStory,
  setStories
} = roomSlice.actions;

export default roomSlice.reducer;