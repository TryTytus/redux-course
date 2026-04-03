// ══════════════════════════════════════════════════════════════
// LESSON 5 EXERCISE — createSelector
// ══════════════════════════════════════════════════════════════
// SCENARIO: A product filter component has three selectors defined
// inline in the component body. They run on EVERY render, even
// when the product list hasn't changed. Memoize them!
// ══════════════════════════════════════════════════════════════

import { configureStore, createSlice } from '@reduxjs/toolkit';
// ❌ TODO: import createSelector from '@reduxjs/toolkit'

interface Product { id: number; name: string; price: number; category: string; }

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [
      { id: 1, name: 'RTK Course',    price: 49, category: 'courses' },
      { id: 2, name: 'Redux Book',    price: 29, category: 'books'   },
      { id: 3, name: 'Immer Guide',   price: 19, category: 'books'   },
      { id: 4, name: 'DevTools Pack', price: 0,  category: 'tools'   },
    ] as Product[],
    minPrice: 10,
    theme: 'dark' as string,  // ← unrelated state
  },
  reducers: {
    setMinPrice: (s, a: { payload: number }) => { s.minPrice = a.payload; },
    toggleTheme: (s) => { s.theme = s.theme === 'dark' ? 'light' : 'dark'; }, // ← shouldn't trigger our selectors
  },
});

export const { setMinPrice, toggleTheme } = productsSlice.actions;
export const store = configureStore({ reducer: { products: productsSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;

// ── BASE SELECTORS (keep these as-is) ─────────────────────────────────────
export const selectAllItems = (state: RootState) => state.products.items;
export const selectMinPrice = (state: RootState) => state.products.minPrice;

// ══════════════════════════════════════════════════════════════
// ❌ NOT MEMOIZED — these run on every render
// ══════════════════════════════════════════════════════════════

export const selectExpensiveItems = (state: RootState) =>
  state.products.items.filter(p => p.price >= state.products.minPrice); // recalculates always!

export const selectItemCount = (state: RootState) =>
  state.products.items.filter(p => p.price >= state.products.minPrice).length; // duplicate work!

export const selectTotalValue = (state: RootState) =>
  state.products.items
    .filter(p => p.price >= state.products.minPrice)
    .reduce((sum, p) => sum + p.price, 0); // triple duplicate!

// ══════════════════════════════════════════════════════════════
// YOUR TASK:
// 1. Import createSelector at the top
// 2. Rewrite selectExpensiveItems using createSelector
//    inputs: [selectAllItems, selectMinPrice]
// 3. Rewrite selectItemCount — chain off selectExpensiveItems!
// 4. Rewrite selectTotalValue — chain off selectExpensiveItems!
// ══════════════════════════════════════════════════════════════
// ✅ DONE WHEN: Changing theme doesn't trigger these selectors to rerun
