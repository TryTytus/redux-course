import React from 'react';
import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO — two separate slices composed with combineReducers ───────────────
const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [] as { id: number; name: string }[], count: 0 },
  reducers: { addUser: (s, a: { payload: string }) => { s.list.push({ id: ++s.count, name: a.payload }); } },
});
const productsSlice = createSlice({
  name: 'products',
  initialState: { list: [] as { id: number; title: string }[], count: 0 },
  reducers: { addProduct: (s, a: { payload: string }) => { s.list.push({ id: ++s.count, title: a.payload }); } },
});
const rootReducer = combineReducers({
  users:    usersSlice.reducer,
  products: productsSlice.reducer,
});
const demoStore = configureStore({ reducer: rootReducer });
type DS = ReturnType<typeof demoStore.getState>;

const SAMPLE_USERS    = ['Alice', 'Bob', 'Carol'];
const SAMPLE_PRODUCTS = ['RTK Course', 'Redux Book', 'Immer Guide'];
let ui = 0, pi = 0;

function Demo() {
  const users    = useSelector((s: DS) => s.users.list);
  const products = useSelector((s: DS) => s.products.list);
  const dispatch  = useDispatch();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', borderColor: 'rgba(0,216,255,0.4)', color: 'var(--secondary)' }} onClick={() => dispatch(usersSlice.actions.addUser(SAMPLE_USERS[ui++ % 3]) as any)}>+ Add User</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', borderColor: 'rgba(255,71,133,0.4)', color: 'var(--accent)' }} onClick={() => dispatch(productsSlice.actions.addProduct(SAMPLE_PRODUCTS[pi++ % 3]) as any)}>+ Add Product</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="demo-card" style={{ borderColor: 'rgba(0,216,255,0.3)' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>state.users</p>
          {users.map(u => <div key={u.id} style={{ fontSize: '0.8rem', padding: '0.2rem 0', color: 'var(--text-2)' }}>#{u.id} {u.name}</div>)}
          {users.length === 0 && <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', margin: 0 }}>empty</p>}
        </div>
        <div className="demo-card" style={{ borderColor: 'rgba(255,71,133,0.3)' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>state.products</p>
          {products.map(p => <div key={p.id} style={{ fontSize: '0.8rem', padding: '0.2rem 0', color: 'var(--text-2)' }}>#{p.id} {p.title}</div>)}
          {products.length === 0 && <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', margin: 0 }}>empty</p>}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Adding a user only re-renders components subscribed to <code>state.users</code>. Products don't care.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={9} title="combineReducers" badge="Utility"
      whatIsIt={<><code>combineReducers({'{ users: usersReducer, products: productsReducer }'})</code> merges multiple reducers into one root reducer. Each reducer manages its own <strong>branch</strong> of state. When you pass an object to <code>configureStore</code>'s <code>reducer:</code> key, RTK calls <code>combineReducers</code> for you automatically.</>}
      whenToUse={[
        'When your state grows large and you want feature-based separation',
        'When multiple developers each own a slice of state',
        'Explicitly when integrating RTK into an existing non-slice reducer setup',
        'Note: configureStore({ reducer: { a, b } }) calls combineReducers automatically!',
      ]}
      howItWorks={`import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Each reducer owns its own branch:
const rootReducer = combineReducers({
  users:    usersSlice.reducer,    // state.users
  products: productsSlice.reducer, // state.products
  cart:     cartSlice.reducer,     // state.cart
});

// configureStore does this automatically when you pass an object:
const store = configureStore({
  reducer: {              // ← same as combineReducers({ ... })
    users:    usersSlice.reducer,
    products: productsSlice.reducer,
  }
});`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Split a Monolith Slice into Two"
      exerciseContext={<>The exercise file has one giant <code>appSlice</code> managing both users and products. This is hard to maintain. Split it into <code>usersSlice</code> and <code>productsSlice</code> and combine them.</>}
      exerciseSteps={[
        { text: 'Open the exercise file — read the monolith appSlice', hint: 'src/lessons/09-combine-reducers/exerciseApp.ts' },
        { text: 'Create a new usersSlice with only user-related state and reducers', hint: 'initialState: { list: [], loading: false }' },
        { text: 'Create a new productsSlice with only product-related state and reducers', hint: 'initialState: { items: [], filter: null }' },
        { text: 'Combine them in configureStore: { reducer: { users: usersSlice.reducer, products: productsSlice.reducer } }', hint: 'No need to call combineReducers manually — configureStore handles it' },
        { text: 'Update all selectors from state.app.users to state.users', hint: 'Search for state.app in the file and update the paths' },
      ]}
      exerciseFile="src/lessons/09-combine-reducers/exerciseApp.ts"
      solution={`// ✅ Split slice 1:
const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [] as User[], loading: false },
  reducers: { addUser: (s, a) => { s.list.push(a.payload); } }
});

// ✅ Split slice 2:
const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] as Product[], filter: null as string | null },
  reducers: { addProduct: (s, a) => { s.items.push(a.payload); } }
});

// ✅ configureStore combines them automatically:
const store = configureStore({
  reducer: {
    users:    usersSlice.reducer,    // state.users.*
    products: productsSlice.reducer, // state.products.*
  }
});`}
      onComplete={onComplete}
    />
  );
}
