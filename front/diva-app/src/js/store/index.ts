import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

// Define a type for the slice of the Redux store this reducer is responsible for
export type RootState = ReturnType<typeof store.getState>;

// Define a type for dispatched actions
export type AppDispatch = typeof store.dispatch;