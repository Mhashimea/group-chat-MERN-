import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  isAuthenticated: boolean;
  user: any;
}

const initialState: AppState = {
  isAuthenticated: false,
  user: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuth, setUser } = appSlice.actions;

export default appSlice.reducer;
