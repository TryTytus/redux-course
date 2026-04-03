import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import * as ex from './exerciseSlice'; // ← YOUR exercise file drives this demo

const PRODUCTS = [
  { id: 1, name: '⚙️ RTK Course' },
  { id: 2, name: '📖 Redux Book' },
  { id: 3, name: '🛠️ DevTools Pack' },
];

function Demo() {
  const items    = useSelector((s: any) => s?.cart?.items ?? []);
  const dispatch = useDispatch();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {PRODUCTS.map(p => (
          <button key={p.id} className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
            onClick={() => dispatch(ex.addItem(p) as any)}>
            + {p.name}
          </button>
        ))}
        <button className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', color: 'var(--error)', marginLeft: 'auto' }}
          onClick={() => dispatch((ex as any).clearCart?.() as any)}>
          Clear
        </button>
      </div>

      {items.length === 0 && <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.85rem' }}>Cart empty — add items above</p>}
      {items.map((item: any) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 0.9rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
          <span style={{ flex: 1, fontSize: '0.85rem' }}>{item.name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-1)', padding: '0.2rem', borderRadius: '6px' }}>
            <button style={{ width: '24px', height: '24px', color: 'white', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display:'flex', alignItems:'center', justifyContent:'center' }}
              onClick={() => dispatch((ex as any).updateQuantity?.({ id: item.id, delta: -1 }) as any)}>−</button>
            <span style={{ minWidth: '20px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{item.qty}</span>
            <button style={{ width: '24px', height: '24px', color: 'white', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display:'flex', alignItems:'center', justifyContent:'center' }}
              onClick={() => dispatch((ex as any).updateQuantity?.({ id: item.id, delta: 1 }) as any)}>+</button>
          </div>
          <button style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}
            onClick={() => dispatch((ex as any).removeItem?.({ id: item.id }) as any)}>✕</button>
        </div>
      ))}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 <strong>addItem works</strong> immediately. The −/+ and Clear buttons need <code>updateQuantity</code> and <code>clearCart</code> — implement them in <code>exerciseSlice.ts</code>!
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={2}
      title="createSlice + Immer"
      badge="Senior Essential"
      whatIsIt={<><code>createSlice()</code> bundles a reducer, its initial state, and action creators into one object. Inside a slice, RTK's built-in <strong>Immer</strong> library lets you write <em>mutations</em> (<code>state.x = 1</code>, <code>state.arr.push()</code>) that are actually converted to safe immutable updates under the hood.</>}
      whenToUse={[
        'For every feature\'s state — cart, user, notifications, etc.',
        'When state updates would require deep spreads — Immer makes them trivial',
        'When you want action creators auto-generated (no more writing them by hand)',
        'Always in modern RTK apps — createSlice is the primary building block',
      ]}
      howItWorks={`const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    // ✅ Immer: looks like mutation, is actually immutable
    addItem: (state, action) => {
      state.items.push(action.payload); // safe!
    },
    removeItem: (state, action) => {
      const i = state.items.findIndex(x => x.id === action.payload);
      state.items.splice(i, 1); // safe!
    },
  },
});
export const { addItem, removeItem } = cartSlice.actions;`}
      liveDemo={
        <Provider store={ex.store}>
          <ErrorBoundary>
            <Demo />
          </ErrorBoundary>
        </Provider>
      }
      exerciseTitle="Add Missing Reducers"
      exerciseContext={<>The cart above runs <strong>your</strong> <code>exerciseSlice.ts</code>. <code>addItem</code> already works — add items and see them appear. Your job: implement <code>updateQuantity</code> (the −/+ buttons) and <code>clearCart</code>. Use Immer — you can mutate <code>state</code> directly!</>}
      exerciseSteps={[
        { text: 'Open exerciseSlice.ts — find the two TODO reducers', hint: 'src/lessons/02-create-slice/exerciseSlice.ts' },
        { text: 'Implement updateQuantity: find item by id, add delta to qty. If qty ≤ 0 remove it.', hint: 'state.items.findIndex() + state.items.splice() — Immer makes both safe!' },
        { text: 'Implement clearCart: reset items to empty array', hint: 'state.items = [] — yes, reassigning is fine with Immer' },
        { text: 'Export updateQuantity and clearCart from cartSlice.actions', hint: 'export const { addItem, updateQuantity, clearCart } = cartSlice.actions' },
      ]}
      exerciseFile="src/lessons/02-create-slice/exerciseSlice.ts"
      solution={`updateQuantity: (state, action: PayloadAction<{ id: number; delta: number }>) => {
  const item = state.items.find(i => i.id === action.payload.id);
  if (!item) return;
  item.qty += action.payload.delta;
  if (item.qty <= 0) {
    const idx = state.items.findIndex(i => i.id === action.payload.id);
    state.items.splice(idx, 1); // Immer-safe
  }
},
clearCart: (state) => {
  state.items = []; // Immer-safe
},
export const { addItem, updateQuantity, clearCart } = cartSlice.actions;`}
      onComplete={onComplete}
    />
  );
}
