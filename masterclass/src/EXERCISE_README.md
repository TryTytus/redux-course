# Module 1 Exercise: The Broken E-Commerce Cart

Welcome to your first active coding exercise! This React application implements a "vanilla" Flux/Redux architecture (using a custom store, no external libraries yet). 

However, **it is deeply broken**. It violates several core principles of Redux Module 1.

## Your Mission
Open your editor (VS Code) and refactor the code to adhere strictly to Redux principles. 

### 🐛 Bug 1: The Impure Reducer (`src/store.ts`)
The `ADD_TO_CART` action inside the reducer uses `Date.now()` to set an `addedAt` timestamp. 
**Task:** Reducers must be pure. Move the `Date.now()` call out of the reducer and into the `Action Creator` (`addToCart` function).

### 🐛 Bug 2: Array Immutability (`src/store.ts`)
The reducer mutates the arrays directly using `.push()`. React won't detect these changes properly, and it ruins time-travel debugging. 
**Task:** Refactor `ADD_TO_CART` to use the spread operator `[...]` to create a new array without mutating the old one.

### 🐛 Bug 3: Nested Object Immutability (`src/store.ts`)
The `UPDATE_QUANTITY` action finds an item in the array and directly mutates its property (`item.quantity += 1`). 
**Task:** Refactor the action to return a *new* cart array, containing a *new* item object with the updated quantity. (Hint: `.map()` is your friend).

### 🐛 Bug 4: Bypassing the Dispatcher (`src/components/ProductList.tsx`)
The UI is violating the "One-Way Data Flow" principle by mutating the global state object directly instead of dispatching an action.
**Task:** Find the `handleDirectDiscount` function and replace the direct mutation with a proper `dispatch(applyDiscount(...))` call.

### 🐛 Bug 5: Single Source of Truth (`src/components/Cart.tsx`)
The Cart component attempts to maintain its own local `cartTotal` state, tracking it separately. It frequently gets out of sync when discounts are applied.
**Task:** Remove the local `cartTotal` state entirely. Derive the total directly from the `store.getState()` during render.

---

### How to Run:
```bash
pnpm run dev
```
Start fixing the bugs one by one and watch the React UI start updating correctly again!
