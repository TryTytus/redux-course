// Store that powers the Dashboard exercise environment
import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { name: 'Alice Chen', email: 'alice@redux.dev', role: 'Senior Dev' },
  reducers: { updateName: (s, a: { payload: string }) => { s.name = a.payload; } },
});
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: { inc: s => { s.value++; } },
});

export const { updateName } = userSlice.actions;
export const { inc } = counterSlice.actions;
export const store = configureStore({ reducer: { user: userSlice.reducer, counter: counterSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
