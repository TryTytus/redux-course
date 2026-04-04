// ══════════════════════════════════════════════════════════════
// LESSON 9 EXERCISE — combineReducers
// ══════════════════════════════════════════════════════════════
// SCENARIO: A monolith appSlice manages both users AND products.
// This breaks the separation of concerns principle. Split it!
// ══════════════════════════════════════════════════════════════

import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';

// ══════════════════════════════════════════════════════════════
// ❌ PROBLEM: One giant slice doing too much
// ══════════════════════════════════════════════════════════════

interface User    { id: number; name: string; role: 'admin' | 'user'; }
interface Product { id: number; title: string; price: number; }

const appSlice = createSlice({
  name: 'app',
  // ❌ Too much state in one slice!
  initialState: {
    users:          [] as User[],
    usersLoading:   false,
    products:       [] as Product[],
    productsFilter: null as string | null,
    activeTab:      'users' as 'users' | 'products',
  },
  reducers: {
    // User actions mixed with product actions in one place:
    addUser:          (s, a: { payload: User })    => { s.users.push(a.payload); },
    setUsersLoading:  (s, a: { payload: boolean }) => { s.usersLoading = a.payload; },
    addProduct:       (s, a: { payload: Product }) => { s.products.push(a.payload); },
    setProductFilter: (s, a: { payload: string | null }) => { s.productsFilter = a.payload; },
    setActiveTab:     (s, a: { payload: 'users' | 'products' }) => { s.activeTab = a.payload; },
  },
});


const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list:          [] as User[],
    loading:   false,
  },
  reducers: {
    addUser:          (s, a: { payload: User })    => { s.list.push(a.payload); },
    setUsersLoading:  (s, a: { payload: boolean }) => { s.loading = a.payload; },
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:       [] as Product[],
    filter: null as string | null,
  },
  reducers: {
    addProduct:       (s, a: { payload: Product }) => { s.items.push(a.payload); },
    setProductFilter: (s, a: { payload: string | null }) => { s.filter = a.payload; },
  }
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeTab:      'users' as 'users' | 'products',
  },
  reducers: {
    setActiveTab:     (s, a: { payload: 'users' | 'products' }) => { s.activeTab = a.payload; },
  }
});


const rootReducer = combineReducers({
  users: usersSlice.reducer,
  products: productsSlice.reducer,
  ui: uiSlice.reducer
})



// ❌ Selectors over the monolith (wrong shape — update these after splitting)
export const selectUsers    = (s: any) => s?.users?.list ?? s?.app?.users ?? [];
export const selectProducts = (s: any) => s?.products?.items ?? s?.app?.products ?? [];

// ❌ Action creators — currently from appSlice (will break after split, that's expected)
// export const { addUser, setUsersLoading, addProduct, setProductFilter, setActiveTab } = appSlice.actions;
export const { addUser, setUsersLoading } = usersSlice.actions;
export const { addProduct, setProductFilter } = productsSlice.actions;
export const { setActiveTab } = uiSlice.actions;

export const store = configureStore({ reducer: rootReducer});
export type RootState = ReturnType<typeof store.getState>;

// ══════════════════════════════════════════════════════════════
// YOUR TASK: Split into THREE focused slices:
// 1. usersSlice    → { list: User[], loading: boolean }
// 2. productsSlice → { items: Product[], filter: string | null }
// 3. uiSlice       → { activeTab: 'users' | 'products' }
//
// Then combine in configureStore:
//   reducer: { users: usersSlice.reducer, products: ..., ui: ... }
//
// Update selectors:
//   selectUsers:   s => s.users.list       (not s.app.users)
//   selectProducts s => s.products.items   (not s.app.products)
// ══════════════════════════════════════════════════════════════
// ✅ DONE WHEN: state tree is:
//   { users: {...}, products: {...}, ui: {...} }
//   instead of: { app: { users, products, activeTab, ... } }
