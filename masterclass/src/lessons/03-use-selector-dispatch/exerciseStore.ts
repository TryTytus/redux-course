// ══════════════════════════════════════════════════════════════
// LESSON 3 EXERCISE — useSelector + useDispatch
// ══════════════════════════════════════════════════════════════
// SCENARIO: A notification bell shows hardcoded data.
// Connect it to the Redux store using useSelector + useDispatch.
// ══════════════════════════════════════════════════════════════

import { configureStore, createSlice } from '@reduxjs/toolkit';

interface Notification { id: number; message: string; read: boolean; }
interface NotificationsState { items: Notification[]; unreadCount: number; }

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [
      { id: 1, message: '🎉 Welcome to Redux Masterclass!', read: false },
      { id: 2, message: '📦 New lesson available: createSlice', read: false },
      { id: 3, message: '✅ Exercise 1 completed', read: true },
    ],
    unreadCount: 2,
  } as NotificationsState,
  reducers: {
    markAllRead: (state) => {
      state.items.forEach(n => { n.read = true; });
      state.unreadCount = 0;
    },
    addNotification: (state, action: { payload: string }) => {
      state.items.push({ id: Date.now(), message: action.payload, read: false });
      state.unreadCount += 1;
    },
  },
});

export const { markAllRead, addNotification } = notificationsSlice.actions;
export const store = configureStore({ reducer: { notifications: notificationsSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
