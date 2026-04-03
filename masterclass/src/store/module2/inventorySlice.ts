// MODULE 2 — Redux Toolkit: createSlice
// Topic: Slices, Immer Mutations, Action Creators

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

// ✅ Type definitions for this slice
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface InventoryState {
  items: Product[];
  filterCategory: string | null;
  searchQuery: string

  // DONE
  // ❌ EXERCISE 1: Missing field! Add a 'searchQuery: string' field here
  // and initialize it to '' below in the initialState.
  // Then add a 'setSearchQuery' reducer that updates it.
}

const initialState: InventoryState = {
  items: [
    { id: 1, name: 'Redux Fundamentals Book',   price: 29.99, category: 'books',  stock: 10 },
    { id: 2, name: 'React Context API Guide',   price: 15.00, category: 'books',  stock: 5  },
    { id: 3, name: 'Immer Deep Dive (ebook)',   price: 9.99,  category: 'books',  stock: 99 },
    { id: 4, name: 'Redux DevTools Extension',  price: 0,     category: 'tools',  stock: 99 },
    { id: 5, name: 'State Management T-Shirt',  price: 24.99, category: 'merch',  stock: 3  },
    { id: 6, name: 'RTK Query Crash Course',    price: 19.99, category: 'courses',stock: 50 },
    { id: 7, name: 'Immer Immutability Cheatsheet', price: 5.00, category: 'books', stock: 20 },
  ],
  filterCategory: null,
  // ❌ EXERCISE 1: Add searchQuery: '' here
  searchQuery: ''
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    /**
     * ✅ LESSON: With RTK, you CAN write "mutating" code.
     * Immer intercepts it and produces an immutable update under the hood.
     * This is the SAME result as spreading, but far more readable.
     */
    applyDiscount: (state, action: PayloadAction<{ productId: number; percent: number }>) => {
      const item = state.items.find(p => p.id === action.payload.productId);
      if (item) {
        // ✅ This LOOKS like a mutation — but Immer makes it safe!
        item.price = parseFloat((item.price * (1 - action.payload.percent / 100)).toFixed(2));
      }
    },

    setFilterCategory: (state, action: PayloadAction<string | null>) => {
      state.filterCategory = action.payload;
    },

    // ❌ EXERCISE 1: Add 'setSearchQuery' reducer here
    // It should accept a string payload and set state.searchQuery

    setSearchQuery: (state, action: PayloadAction<string | null>) => {
      state.searchQuery = action.payload || ''
    },

    restockItem: (state, action: PayloadAction<{ productId: number; amount: number }>) => {
      const item = state.items.find(p => p.id === action.payload.productId);
      if (item) {
        item.stock += action.payload.amount;
      }
    },

    /**
     * ❌ EXERCISE 2: Add a 'bulkDiscount' reducer.
     * It should accept { category: string; percent: number } as payload.
     * It should apply a discount to ALL products in a given category.
     * Hint: Use state.items.forEach() — it's safe inside a reducer with Immer!
     */
    bulkDiscount: (state, action: PayloadAction<{ category: string; percent: number }>) => {
        state.items.forEach(item => {
          const afterDiscount = item.price -  item.price * 20;
          item.price = (item.category === action.payload.category) ? afterDiscount : item.price 
        })
    }
  },
});

export const { applyDiscount, setFilterCategory, restockItem } = inventorySlice.actions;

// ============================================================
// SELECTORS
// ============================================================

/**
 * ❌ EXERCISE 3: Replace these basic selectors with memoized selectors
 * using createSelector from '@reduxjs/toolkit'.
 * 
 * Steps:
 * 1. Import createSelector at the top of the file.
 * 2. Rewrite 'selectFilteredInventory' using createSelector.
 * 3. Verify in React DevTools that the selector is NOT re-running when
 *    the cart changes (only the inventory/filter changes should trigger it).
 */

// Basic selector (not memoized)
// export const selectAllInventory = useSelector((state: RootState) => state.inventory.items)
// export const selectFilterCategory = useSelector((state: RootState) => state.inventory)
export const selectAllInventory = (state: RootState) => state.inventory.items;
export const selectFilterCategory = (state: RootState) => state.inventory.filterCategory;

// ❌ EXERCISE 3: This runs every render. Make it memoized!
export const selectFilteredInventory = (state: RootState): Product[] => {
  const { items, filterCategory } = useSelector((state: RootState) => state.inventory);
  if (!filterCategory) return items;
  return items.filter(p => p.category === filterCategory);
};

// ❌ EXERCISE 1 (part 2): Add a selectSearchQuery selector
export const selectCategories = (state: RootState): string[] => {
  const items = useSelector((state: RootState) => state.inventory.items)
  const cats = items.map(p => p.category);
  return Array.from(new Set(cats));
};
