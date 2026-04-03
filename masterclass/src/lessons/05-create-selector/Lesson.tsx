import React, { useState, useRef } from 'react';
import { configureStore, createSlice, createSelector } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO STORE ─────────────────────────────────────────────────────────────
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [
      { id: 1, name: 'RTK Course',    price: 49, category: 'courses' },
      { id: 2, name: 'Redux Book',    price: 29, category: 'books'   },
      { id: 3, name: 'Immer Guide',   price: 19, category: 'books'   },
      { id: 4, name: 'DevTools Pack', price: 0,  category: 'tools'   },
      { id: 5, name: 'State T-Shirt', price: 24, category: 'merch'   },
    ],
    minPrice: 0,
    theme: 'dark' as string, // unrelated state — won't affect selector
  },
  reducers: {
    setMinPrice:  (s, a: { payload: number }) => { s.minPrice = a.payload; },
    toggleTheme:  (s) => { s.theme = s.theme === 'dark' ? 'light' : 'dark'; },
  },
});
const demoStore = configureStore({ reducer: { products: productsSlice.reducer } });
type DS = ReturnType<typeof demoStore.getState>;

const selectItems    = (s: DS) => s.products.items;
const selectMinPrice = (s: DS) => s.products.minPrice;

// ── Memoized selector — only recomputes when items OR minPrice changes ──────
let selectorRunCount = 0;
const selectFiltered = createSelector(
  [selectItems, selectMinPrice],
  (items, min) => {
    selectorRunCount++;
    return items.filter(p => p.price >= min);
  }
);

// ── LIVE DEMO ──────────────────────────────────────────────────────────────
function Demo() {
  const dispatch    = useDispatch();
  const filtered    = useSelector(selectFiltered);
  const minPrice    = useSelector(selectMinPrice);
  const [count, setCount] = useState(0);

  const handleRelated   = (val: number) => { dispatch(productsSlice.actions.setMinPrice(val) as any); setCount(selectorRunCount); };
  const handleUnrelated = ()            => { dispatch(productsSlice.actions.toggleTheme()    as any); setCount(selectorRunCount); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Selector ran:</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--warning)' }}>{count} times</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Min price: ${minPrice}</span>
        <button className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', borderColor: 'rgba(16,185,129,0.4)', color: 'var(--success)' }} onClick={() => handleRelated(minPrice + 10)}>+$10 filter → selector RUNS</button>
        <button className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={handleUnrelated}>Flip theme → selector SKIPS ✓</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {filtered.map(p => (
          <div key={p.id} style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{p.name}</span><span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>${p.price}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Flip the theme (unrelated state) — the selector count doesn't change! That's memoization.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={5}
      title="createSelector"
      badge="Senior Essential"
      whatIsIt={<>
        <code>createSelector</code> creates <strong>memoized</strong> selectors. It takes <em>input selectors</em> and a <em>result function</em>. The result function only re-runs when at least one input selector returns a new value — otherwise it returns the <strong>cached result</strong>, preventing unnecessary computation and re-renders.
      </>}
      whenToUse={[
        'When deriving data from state (filtering arrays, computing totals, sorting)',
        'When a selector is called often and its computation is expensive',
        'When the selector returns a new object/array reference each time (causes re-renders)',
        'When multiple components share the same derived data',
      ]}
      howItWorks={`import { createSelector } from '@reduxjs/toolkit';

// Input selectors — these are called on every state change
const selectItems    = (state) => state.products.items;
const selectMinPrice = (state) => state.products.minPrice;

// Result function — ONLY called when items or minPrice changes
const selectFiltered = createSelector(
  [selectItems, selectMinPrice],    // ← inputs
  (items, minPrice) =>              // ← result function (memoized)
    items.filter(p => p.price >= minPrice)
);

// Usage in component — same as any selector:
const filtered = useSelector(selectFiltered);`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Memoize an Expensive Product Filter"
      exerciseContext={<>
        A product filter component recomputes on <strong>every render</strong> because its selector is defined inline. Open the file and rewrite the three inline computations as memoized <code>createSelector</code> calls.
      </>}
      exerciseSteps={[
        { text: 'Open the exercise file — find the three inline selector functions', hint: 'src/lessons/05-create-selector/exerciseSelectors.ts' },
        { text: 'Import createSelector from "@reduxjs/toolkit"', hint: 'import { createSelector } from "@reduxjs/toolkit"' },
        { text: 'Rewrite selectExpensiveItems using createSelector with two input selectors: selectAllItems and selectMinPrice', hint: 'createSelector([selectAllItems, selectMinPrice], (items, min) => items.filter(...))' },
        { text: 'Rewrite selectItemCount and selectTotalValue the same way', hint: 'selectItemCount just needs selectExpensiveItems as input — chain selectors!' },
      ]}
      exerciseFile="src/lessons/05-create-selector/exerciseSelectors.ts"
      solution={`import { createSelector } from '@reduxjs/toolkit';

const selectAllItems = (state: RootState) => state.products.items;
const selectMinPrice = (state: RootState) => state.products.minPrice;

// ✅ Memoized — only recomputes when items or minPrice changes
export const selectExpensiveItems = createSelector(
  [selectAllItems, selectMinPrice],
  (items, min) => items.filter(p => p.price >= min)
);

// ✅ Chains off previous selector — runs only when filtered result changes
export const selectItemCount = createSelector(
  [selectExpensiveItems],
  (items) => items.length
);

export const selectTotalValue = createSelector(
  [selectExpensiveItems],
  (items) => items.reduce((sum, p) => sum + p.price, 0)
);`}
      onComplete={onComplete}
    />
  );
}
