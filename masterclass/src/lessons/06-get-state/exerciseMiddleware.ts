// ══════════════════════════════════════════════════════════════
// LESSON 6 EXERCISE — getState
// ══════════════════════════════════════════════════════════════
// SCENARIO: Build a logger middleware that uses getState() to
// log state before and after every action.
// ══════════════════════════════════════════════════════════════

import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, label: 'My Counter' },
  reducers: {
    increment: s => { s.value++; },
    decrement: s => { s.value--; },
    setLabel:  (s, a: { payload: string }) => { s.label = a.payload; },
  },
});

// ══════════════════════════════════════════════════════════════
// ❌ INCOMPLETE — finish this middleware using store.getState()
// ══════════════════════════════════════════════════════════════

export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  // ❌ Step 1: Call store.getState() to read state BEFORE the action
  // const prevState = ???

  // ❌ Step 2: Call next(action) to pass it to the reducer
  // const result = ???

  // ❌ Step 3: Call store.getState() AGAIN to read state AFTER the action
  // const nextState = ???

  // ❌ Step 4: Log the before/after
  // console.group(`Action: ${(action as any).type}`);
  // console.log('Before:', prevState);
  // console.log('After:', nextState);
  // console.groupEnd();

  // ❌ Step 5: Return the result
  // return result;
};

// ══════════════════════════════════════════════════════════════
// ❌ TODO: Add loggerMiddleware to configureStore below
// ══════════════════════════════════════════════════════════════

export const { increment, decrement, setLabel } = counterSlice.actions;
export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
  // ❌ TODO: add middleware option here:
  // middleware: (getDefault) => getDefault().concat(loggerMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;

// ✅ DONE WHEN: Open DevTools console and dispatch an action.
//   You should see "Action: counter/increment" with before/after state logged.
