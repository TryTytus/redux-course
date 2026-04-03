// MODULE 2 — RTK: configureStore
// Topic: Combining slices, middleware, DevTools

import { configureStore } from '@reduxjs/toolkit';
import { inventorySlice } from './inventorySlice';
import { cartSlice } from './cartSlice';

/**
 * ✅ LESSON: configureStore automatically:
 * 1. Combines your slices into a root reducer
 * 2. Adds redux-thunk middleware
 * 3. Enables Redux DevTools (in development)
 * 4. Adds Immer to every slice reducer (lets you write "mutating" code safely)
 *
 * Compare this to the 20-line vanilla Store class in Module 1!
 */
export const store = configureStore({
  reducer: {
    inventory: inventorySlice.reducer,
    cart: cartSlice.reducer,
  },

  /**
   * ❌ EXERCISE 7 (Exploration): Open Redux DevTools.
   * - Dispatch some actions (add items, apply coupon, add discount)
   * - Use the "Diff" tab to see exactly what changed in state
   * - Use "Jump" to time-travel to a previous state
   * - Use the "Action" tab to see the full action object
   * 
   * Answer these questions in your notes:
   * Q1: What is the full action.type string when you add an item? (format: "sliceName/actionName")
   * Q2: Can you find the moment a coupon was applied in the action log?
   * Q3: What happens to the state when you "Jump" to an earlier action?
   */
});

// Infer types from the store itself — this is the idiomatic RTK pattern
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
