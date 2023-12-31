import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app';
import GroupReducer from './groups';

export const store = configureStore({
  reducer: {
    app: appReducer,
    groups: GroupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
