//src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import pokerReducer from './features/pokerSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    poker: pokerReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});