import React, { useState } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO STORE ─────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as { id: number; name: string; qty: number }[] },
  reducers: {
    addItem: (state, action: { payload: { id: number; name: string } }) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) { existing.qty += 1; }
      else { state.items.push({ ...action.payload, qty: 1 }); } // ← Immer makes push() safe!
    },
    removeItem: (state, action: { payload: number }) => {
      const idx = state.items.findIndex(i => i.id === action.payload);
      if (idx !== -1) state.items.splice(idx, 1); // ← Immer makes splice() safe!
    },
    clearCart: state => { state.items = []; },
  },
});
const demoStore = configureStore({ reducer: { cart: cartSlice.reducer } });
type S = ReturnType<typeof demoStore.getState>;

const PRODUCTS = [
  { id: 1, name: '⚙️ RTK Course' },
  { id: 2, name: '📖 Redux Book' },
  { id: 3, name: '🛠️ DevTools Pack' },
];

// ── LIVE DEMO ──────────────────────────────────────────────────────────────
function Demo() {
  const items   = useSelector((s: S) => s.cart.items);
  const dispatch = useDispatch();
  const [mode, setMode] = useState<'immer' | 'spread'>('immer');

  const addCode = mode === 'immer'
    ? `// ✅ Immer — looks like mutation, IS immutable
addItem: (state, action) => {
  const found = state.items.find(i => i.id === action.payload.id);
  if (found) found.qty += 1;  // "mutation" is safe!
  else state.items.push({ ...action.payload, qty: 1 });
}`
    : `// ❌ Old way — manual spreading (tedious)
addItem: (state, action) => {
  const found = state.items.find(i => i.id === action.payload.id);
  if (found) return {
    ...state,
    items: state.items.map(i =>
      i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
    )
  };
  return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className={mode === 'immer' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={() => setMode('immer')}>RTK + Immer</button>
        <button className={mode === 'spread' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={() => setMode('spread')}>Old Way (spread)</button>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-3)', alignSelf: 'center' }}>same result →</span>
      </div>
      <pre style={{ margin: 0, background: 'rgba(0,0,0,0.4)', border: `1px solid ${mode === 'immer' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '8px', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.73rem', lineHeight: 1.65, color: '#e2e8f0', overflowX: 'auto' }}>{addCode}</pre>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {PRODUCTS.map(p => (
          <button key={p.id} className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
            onClick={() => dispatch(cartSlice.actions.addItem(p) as any)}>
            + {p.name}
          </button>
        ))}
        <button className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', color: 'var(--error)', marginLeft: 'auto' }}
          onClick={() => dispatch(cartSlice.actions.clearCart() as any)}>
          Clear
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {items.length === 0 && <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.85rem' }}>Cart empty — add items above</p>}
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.85rem' }}>{item.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--secondary)' }}>×{item.qty}</span>
              <button style={{ color: 'var(--error)', fontSize: '0.8rem' }} onClick={() => dispatch(cartSlice.actions.removeItem(item.id) as any)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={2}
      title="createSlice + Immer"
      badge="Senior Essential"
      whatIsIt={<>
        <code>createSlice()</code> bundles a reducer, its initial state, and action creators into one object. Inside a slice, RTK's built-in <strong>Immer</strong> library lets you write <em>mutations</em> (<code>state.x = 1</code>, <code>state.arr.push()</code>) that are actually converted to safe immutable updates under the hood.
      </>}
      whenToUse={[
        'For every feature\'s state — cart, user, notifications, etc.',
        'When state updates would require deep spreads — Immer makes them trivial',
        'When you want action creators auto-generated (no more writing them by hand)',
        'Always in modern RTK apps — createSlice is the primary building block',
      ]}
      howItWorks={`import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',           // prefix for action types: 'cart/addItem'
  initialState: { items: [] },
  reducers: {
    // ✅ Immer: looks like mutation, is actually immutable
    addItem: (state, action) => {
      state.items.push(action.payload); // safe!
    },
    removeItem: (state, action) => {
      const i = state.items.findIndex(x => x.id === action.payload);
      state.items.splice(i, 1);         // safe!
    },
  },
});

// Auto-generated action creators:
export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Add Missing Reducers to a Cart Slice"
      exerciseContext={<>
        A shopping cart slice already has <code>addItem</code>. It's missing two reducers: <code>updateQuantity</code> and <code>clearCart</code>. The UI is wired up — you just need to add the reducer logic. Remember: you <strong>can</strong> mutate <code>state</code> directly inside a slice reducer!
      </>}
      exerciseSteps={[
        { text: 'Open the exercise file and find the two TODO reducers', hint: 'src/lessons/02-create-slice/exerciseSlice.ts' },
        { text: 'Implement updateQuantity: find the item by id and update its qty. If qty reaches 0, remove it.', hint: 'Use state.items.findIndex() + splice() — Immer makes both safe' },
        { text: 'Implement clearCart: reset items to an empty array', hint: 'state.items = [] — yes, reassigning is fine with Immer!' },
        { text: 'Export the new action creators from the slice actions', hint: 'Destructure from cartSlice.actions like the other exports' },
      ]}
      exerciseFile="src/lessons/02-create-slice/exerciseSlice.ts"
      solution={`updateQuantity: (state, action: PayloadAction<{ id: number; delta: number }>) => {
  const item = state.items.find(i => i.id === action.payload.id);
  if (!item) return;
  item.qty += action.payload.delta;
  if (item.qty <= 0) {
    const idx = state.items.findIndex(i => i.id === action.payload.id);
    state.items.splice(idx, 1); // ← Immer-safe
  }
},

clearCart: (state) => {
  state.items = []; // ← reassigning the draft is also Immer-safe
},

// Export:
export const { addItem, updateQuantity, clearCart } = cartSlice.actions;`}
      onComplete={onComplete}
    />
  );
}
