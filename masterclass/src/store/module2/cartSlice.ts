// MODULE 2 — Redux Toolkit: createSlice (Cart)
// Topic: PayloadAction types, complex Immer patterns, derived state via selectors

import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { Product } from './inventorySlice';

// ✅ Cart item extends product
export interface CartItem extends Product {
  quantity: number;
  addedAt: number; // timestamp — now passed via action payload (not in reducer!)
}

// ✅ Coupon types
type CouponCode = 'REDUX10' | 'RTK20' | 'IMMER50';
const COUPONS: Record<CouponCode, number> = {
  REDUX10: 10,
  RTK20: 20,
  IMMER50: 50,
};

interface CartState {
  items: CartItem[];
  appliedCoupon: CouponCode | null;
  couponError: string | null;
}

const initialState: CartState = {
  items: [],
  appliedCoupon: null,
  couponError: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * ✅ LESSON: The timestamp moves out of the reducer (pure!) and into the action payload.
     * The UI/action creator provides Date.now() before dispatch.
     * The reducer stays pure — it never calls Date.now() itself.
     */
    addToCart: (state, action: PayloadAction<{ product: Product; addedAt: number }>) => {
      const { product, addedAt } = action.payload;
      const existing = state.items.find(i => i.id === product.id);

      if (existing) {
        // ✅ Immer: direct mutation is safe here!
        if (existing.quantity < product.stock) {
          existing.quantity += 1;
        }
      } else {
        // ✅ Immer: push() is safe here!
        state.items.push({ ...product, quantity: 1, addedAt });
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(i => i.id === action.payload);
      if (index !== -1) {
        // ✅ Immer: splice() is safe here!
        state.items.splice(index, 1);
      }
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; delta: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (!item) return;

      const next = item.quantity + action.payload.delta;
      if (next <= 0) {
        // ❌ EXERCISE 4: Right now this does nothing. Fix it!
        // Instead of returning undefined, remove the item from the cart.
        // Hint: Use state.items.splice() or reassign state.items with .filter()
        state.items = state.items.filter(item => item.id !== action.payload.id)
        return;
      }
      item.quantity = Math.min(next, item.stock); // Respect stock limits
    },

    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      state.couponError = null;
    },

    applyCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase() as CouponCode;
      if (COUPONS[code]) {
        state.appliedCoupon = code;
        state.couponError = null;
      } else {
        state.appliedCoupon = null;
        state.couponError = `"${action.payload}" is not a valid coupon. Try REDUX10, RTK20, or IMMER50.`;
      }
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.couponError = null;
    },

    /**
     * ❌ EXERCISE 5: Add a 'setItemNote' reducer.
     * CartItem should have an optional 'note?: string' field.
     * Add it to the CartItem interface above.
     * The reducer should accept { id: number; note: string } and update the item.
     */
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;

// ============================================================
// SELECTORS (createSelector for memoization)
// ============================================================

export const selectCartItems = (state: RootState) => state.cart.items;
const selectAppliedCoupon = (state: RootState) => state.cart.appliedCoupon;

/**
 * ✅ LESSON: createSelector memoizes the result.
 * selectCartSubtotal will ONLY recalculate when state.cart.items changes.
 * If something ELSE changes (inventory filter, etc.) this selector returns
 * the cached value — no wasted computation!
 */
export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const selectCartDiscount = createSelector(
  [selectCartSubtotal, selectAppliedCoupon],
  (subtotal, coupon) => {
    if (!coupon) return 0;
    const percent = { REDUX10: 10, RTK20: 20, IMMER50: 50 }[coupon];
    return parseFloat((subtotal * (percent / 100)).toFixed(2));
  }
);

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartDiscount],
  (subtotal, discount) => parseFloat((subtotal - discount).toFixed(2))
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCouponError = (state: RootState) => state.cart.couponError;
export const selectAppliedCouponCode = (state: RootState) => state.cart.appliedCoupon;

/**
 * ❌ EXERCISE 6 (Hard): Create a memoized selector 'selectCartItemsSortedByDate'
 * that returns cart items sorted by their 'addedAt' timestamp, newest first.
 * It should use createSelector so it only re-sorts when items change.
 * 
 * IMPORTANT: When sorting, you must NOT mutate the array.
 * Use [...items].sort(...) — not items.sort(...)
 */
