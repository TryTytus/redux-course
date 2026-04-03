# Module 2 Exercise: Redux Toolkit Mastery

You've conquered the fundamentals. Now it's time to think at the RTK level.

Open the files below and find every `❌ EXERCISE` comment. Complete each one before moving on.

---

## 🧠 Exercise 1 — Extend the Inventory Slice
**File:** `src/store/module2/inventorySlice.ts`

The inventory needs a search feature. Add:
1. A `searchQuery: string` field to `InventoryState` and `initialState`
2. A `setSearchQuery` reducer that updates it
3. A `selectSearchQuery` selector
4. Update `selectFilteredInventory` to also filter by the search query (case-insensitive match on name)

> 💡 **Think:** Can Immer help you here even though it's just `state.searchQuery = action.payload`?

---

## 🧠 Exercise 2 — Bulk Discount Reducer
**File:** `src/store/module2/inventorySlice.ts`

Add a `bulkDiscount` reducer that accepts `{ category: string; percent: number }` and discounts ALL products in that category.

> 💡 **Think:** Is `state.items.forEach(item => { item.price = ... })` safe? Why or why not?

---

## 🧠 Exercise 3 — Memoize the Inventory Selector
**File:** `src/store/module2/inventorySlice.ts`

`selectFilteredInventory` currently runs on EVERY render, even if the inventory didn't change.

1. Import `createSelector` from `@reduxjs/toolkit`
2. Rewrite `selectFilteredInventory` using `createSelector`
3. Open Redux DevTools → watch the action log while filtering
4. Verify: clicking cart buttons should NOT re-run this selector

> 💡 **Think:** What are the "input selectors"? What is the "result function"?

---

## 🔥 Exercise 4 — Fix the Remove-on-Zero Bug
**File:** `src/store/module2/cartSlice.ts`

In `updateQuantity`, when `next <= 0`, the item should be removed from the cart.
Right now there's just a `return;` comment placeholder.

Fix it. You can use:
- `state.items.splice(index, 1)` — Immer-safe
- `state.items = state.items.filter(...)` — Also Immer-safe (reassigning the draft)

> 💡 **Think:** Both approaches work in Immer. Which is more readable? Does it matter?

---

## 🔥 Exercise 5 — Notes on Cart Items
**File:** `src/store/module2/cartSlice.ts`

1. Add `note?: string` to the `CartItem` interface
2. Add a `setItemNote(state, action: PayloadAction<{ id: number; note: string }>)` reducer
3. Export it from the slice and add it to the `CartPanel.tsx` UI (add a small text input next to each item)

> 💡 **Think:** Is this state UI state or domain state? Should it live in the cart slice, or in local component state?

---

## 💎 Exercise 6 — Sort by Date Selector
**File:** `src/store/module2/cartSlice.ts`

Create `selectCartItemsSortedByDate` — a memoized selector that returns cart items sorted by `addedAt`, newest first.

**Critical rule:** You MUST NOT mutate the source array.
```ts
// ❌ Wrong — mutates the Immer draft
items.sort(...)

// ✅ Correct — copy first, then sort
[...items].sort(...)
```

---

## 🌐 Exercise 7 — Redux DevTools Exploration
**No code needed — just explore!**

Open the browser DevTools → Redux tab.

1. Add some items, apply a discount, add a coupon
2. In the **Action** tab: What is the exact `type` string for `addToCart`?
3. In the **Diff** tab: What changed after you applied a coupon?
4. Use **Jump** to travel back to an empty cart. What happens to the UI?
5. In the **State** tab: Find the nested `cart.items[0].addedAt` timestamp. What type is it?

---

### How to Run:
```bash
pnpm run dev
```

Then open the app and click **"Module 2"** in the top tabs to see your work.
