// ══════════════════════════════════════════════════════════════
// LESSON 2 EXERCISE — createSlice + Immer
// ══════════════════════════════════════════════════════════════
// SCENARIO: A shopping cart slice is partially implemented.
// addItem works. Two reducers are missing — implement them.
// ══════════════════════════════════════════════════════════════

import { createSlice, configureStore } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartItem { id: number; name: string; qty: number; }
interface CartState { items: CartItem[]; }

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] } as CartState,
  reducers: {
    // ✅ Already implemented — study how Immer works here
    addItem: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1; // ← "mutation" — Immer converts this to spread internally
      } else {
        state.items.push({ ...action.payload, qty: 1 }); // ← push() is safe with Immer
      }
    },

    // ❌ TODO: implement updateQuantity
    // payload: { id: number; delta: number }
    // - Find the item by id
    // - Add delta to its qty
    // - If qty drops to 0 or below, remove the item from the array
    updateQuantity: (_state, _action: PayloadAction<{ id: number; delta: number }>) => {
      const idx = _state.items.findIndex(item => item.id === _action.payload.id)
      if (idx === -1)
        return _state
      const quantity = _state.items[idx].qty;
      if (quantity > 0)
        _state.items[idx].qty += _action.payload.delta;
      else
        _state.items.splice(idx, 1)
    },

    // ❌ TODO: implement clearCart
    // - Reset items to an empty array
    // Hint: state.items = [] works with Immer!
    clearCart: (_state) => {
      _state.items = []
    },
  },
});

// ❌ TODO: also export updateQuantity and clearCart from the destructured actions
export const { addItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// ══════════════════════════════════════════════════════════════
// ✅ DONE WHEN:
// - updateQuantity removes item when qty <= 0
// - clearCart resets the array to []
// - Both are exported from cartSlice.actions
// ══════════════════════════════════════════════════════════════
