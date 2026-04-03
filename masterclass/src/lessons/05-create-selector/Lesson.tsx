import React, { useRef } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import * as ex from './exerciseSelectors'; // ← YOUR selector file drives this demo

// Track how many times the result reference CHANGES (only matters if new array each time = not memoized)
let prevItems: any = null;
let refChangeCount = 0;

function Demo() {
  const dispatch  = useDispatch();
  const minPrice  = useSelector((s: any) => s?.products?.minPrice ?? 0);
  const items     = useSelector((s: any) => ex.selectExpensiveItems(s));
  const count     = useSelector((s: any) => ex.selectItemCount?.(s) ?? items?.length ?? 0);
  const total     = useSelector((s: any) => ex.selectTotalValue?.(s) ?? 0);
  const renderRef = useRef(0);
  renderRef.current++;

  // Track reference changes — non-memoized selectors always return new arrays
  if (items !== prevItems) { refChangeCount++; prevItems = items; }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
        <div style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>Component renders</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--warning)' }}>{renderRef.current}</div>
        </div>
        <div style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>Selector new refs</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: refChangeCount === renderRef.current ? 'var(--error)' : 'var(--success)' }}>{refChangeCount}</div>
        </div>
        <div style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>Filter ≥ ${minPrice}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--secondary)' }}>{count} items</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', borderColor: 'rgba(16,185,129,0.4)', color: 'var(--success)' }}
          onClick={() => dispatch(ex.setMinPrice(minPrice + 10) as any)}>
          +$10 filter → selector MUST recompute
        </button>
        <button className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          onClick={() => dispatch(ex.toggleTheme() as any)}>
          Flip theme → memoized selector SKIPS ✓
        </button>
      </div>

      {(items ?? []).map((p: any) => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '0.82rem' }}>
          <span>{p.name}</span><span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>${p.price}</span>
        </div>
      ))}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 "Selector new refs" = "Renders" means <strong>NOT memoized</strong> (new array every render). After implementing <code>createSelector</code>, flipping theme should NOT increase "new refs".
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
      whatIsIt={<><code>createSelector</code> creates <strong>memoized</strong> selectors. It takes <em>input selectors</em> and a <em>result function</em>. The result function only re-runs when at least one input returns a new value — otherwise returns the <strong>cached result</strong>, preventing unnecessary re-renders.</>}
      whenToUse={[
        'When deriving data from state — filtering, computing totals, sorting',
        'When a selector returns a new object/array reference each render (causes extra re-renders)',
        'When multiple components share the same expensive derived data',
        'Chain selectors: use one memoized selector as input to another',
      ]}
      howItWorks={`import { createSelector } from '@reduxjs/toolkit';

const selectItems    = (state) => state.products.items;
const selectMinPrice = (state) => state.products.minPrice;

// Only recomputes when items or minPrice changes:
const selectFiltered = createSelector(
  [selectItems, selectMinPrice],   // ← inputs
  (items, minPrice) =>             // ← result (memoized)
    items.filter(p => p.price >= minPrice)
);`}
      liveDemo={
        <Provider store={ex.store}>
          <ErrorBoundary>
            <Demo />
          </ErrorBoundary>
        </Provider>
      }
      exerciseTitle="Memoize 3 Inline Selectors"
      exerciseContext={<>Watch the numbers above. <strong>Selector new refs = Renders</strong> means your selectors create a new array on every render (not memoized yet). Implement <code>createSelector</code> in the exercise file — then flipping the theme won't increase "new refs" because the selector returns the same reference!</>}
      exerciseSteps={[
        { text: 'Open exerciseSelectors.ts — find the three unmemoized selectors', hint: 'src/lessons/05-create-selector/exerciseSelectors.ts' },
        { text: 'Import createSelector from "@reduxjs/toolkit"', hint: 'It\'s already imported in the exercise file — just un-comment it' },
        { text: 'Rewrite selectExpensiveItems using createSelector with [selectAllItems, selectMinPrice] as inputs', hint: 'createSelector([selectAllItems, selectMinPrice], (items, min) => items.filter(...))' },
        { text: 'Rewrite selectItemCount and selectTotalValue — chain them off selectExpensiveItems!', hint: 'createSelector([selectExpensiveItems], (items) => items.length)' },
      ]}
      exerciseFile="src/lessons/05-create-selector/exerciseSelectors.ts"
      solution={`import { createSelector } from '@reduxjs/toolkit';

const selectAllItems = (state: RootState) => state.products.items;
const selectMinPrice = (state: RootState) => state.products.minPrice;

// ✅ Only recomputes when items or minPrice changes:
export const selectExpensiveItems = createSelector(
  [selectAllItems, selectMinPrice],
  (items, min) => items.filter(p => p.price >= min)
);

// ✅ Chains off above — only recomputes when filtered result changes:
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
