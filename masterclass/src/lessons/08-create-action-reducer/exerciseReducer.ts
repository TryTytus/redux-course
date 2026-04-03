// ══════════════════════════════════════════════════════════════
// LESSON 8 EXERCISE — createAction + createReducer
// ══════════════════════════════════════════════════════════════
// SCENARIO: A theme reducer was written in old-school switch/case
// style. Migrate it to createAction + createReducer builder pattern.
// ══════════════════════════════════════════════════════════════

import { configureStore } from '@reduxjs/toolkit';
// ❌ TODO: import createAction, createReducer from '@reduxjs/toolkit'

interface ThemeState { current: string; previous: string | null; }
const initialState: ThemeState = { current: 'dark', previous: null };

// ══════════════════════════════════════════════════════════════
// ❌ OLD WAY — switch/case reducer (fragile, no type inference)
// ══════════════════════════════════════════════════════════════

const SET_THEME   = 'theme/setTheme';
const RESET_THEME = 'theme/reset';

function themeReducer(state = initialState, action: { type: string; payload?: string }): ThemeState {
  switch (action.type) {
    case SET_THEME:
      return { current: action.payload!, previous: state.current };
    case RESET_THEME:
      return { current: 'dark', previous: null };
    default:
      return state;
  }
}

// ❌ Manual action creators (no TypeScript inference!):
const setTheme   = (theme: string) => ({ type: SET_THEME,   payload: theme });
const resetTheme = ()               => ({ type: RESET_THEME });

export { setTheme, resetTheme };
export const store = configureStore({ reducer: { theme: themeReducer } });
export type RootState = ReturnType<typeof store.getState>;

// ══════════════════════════════════════════════════════════════
// YOUR TASK:
// 1. Create typed action creators using createAction:
//    const setTheme   = createAction<string>('theme/setTheme')
//    const resetTheme = createAction('theme/reset')
//
// 2. Rewrite the reducer using createReducer + builder:
//    const themeReducer = createReducer(initialState, builder => {
//      builder
//        .addCase(setTheme, (state, action) => {
//          state.previous = state.current;
//          state.current  = action.payload;    ← TypeScript knows this is string!
//        })
//        .addCase(resetTheme, state => {
//          state.current  = 'dark';
//          state.previous = null;
//        });
//    });
//
// 3. Update the store to use the new reducer
// ══════════════════════════════════════════════════════════════
// ✅ DONE WHEN: setTheme('light') TypeScript types payload as string
//   and the reducer handles it correctly
