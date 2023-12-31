import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GroupStoreProps {
  groups: any[];
  fetchingGroups: boolean;
}

const initialState: GroupStoreProps = {
  groups: [],
  fetchingGroups: false,
};

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    // set groups
    setGroups: (state, action: PayloadAction<any[]>) => {
      state.groups = action.payload;
    },

    // add new group
    addNewGroup: (state, action: PayloadAction<any>) => {
      state.groups.unshift(action.payload);
    },

    // update the group
    updateGroup: (state, action: PayloadAction<any>) => {
      const index = state.groups.findIndex((group) => group._id === action.payload._id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },

    // remove the group
    removeGroup: (state, action: PayloadAction<any>) => {
      const index = state.groups.findIndex((group) => group._id === action.payload._id);
      if (index !== -1) state.groups.splice(index, 1);
    },

    // set fetching groups
    setFetchingGroups: (state, action: PayloadAction<boolean>) => {
      state.fetchingGroups = action.payload;
    },
  },
});

export const { setGroups, addNewGroup, updateGroup, removeGroup, setFetchingGroups } = groupSlice.actions;

export default groupSlice.reducer;
