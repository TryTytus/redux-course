import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import * as ex from './exerciseStore'; // ← YOUR exercise file drives this demo

function Demo() {
  // Flexible selector: works whether state is flat {count} or nested {counter:{value}} etc.
  const count = useSelector((s: any) => s?.count ?? s?.counter?.value ?? s?.counterReducer?.count ?? '?');
  const dispatch = useDispatch();
  const [log, setLog] = useState<string[]>([]);

  const fire = (type: string) => {
    dispatch({ type } as any);
    setLog(prev => [`→ { type: "${type}" }`, ...prev].slice(0, 5));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="demo-row">
        <button className="btn-secondary" style={{ padding: '0.5rem 1.2rem' }} onClick={() => fire('DECREMENT')}>−</button>
        <span className="demo-value">{String(count)}</span>
        <button className="btn-primary" style={{ padding: '0.5rem 1.2rem' }} onClick={() => fire('INCREMENT')}>+</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', marginLeft: 'auto', fontSize: '0.8rem' }} onClick={() => fire('RESET')}>Reset</button>
      </div>
      {log.length > 0 && (
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem' }}>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Action log — open Redux DevTools to see these too!</p>
          {log.map((l, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: i === 0 ? 'var(--success)' : 'var(--text-3)', opacity: 1 - i * 0.18, padding: '0.1rem 0' }}>{l}</div>
          ))}
        </div>
      )}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 This demo runs <strong>your</strong> <code>exerciseStore.ts</code>. After migrating to <code>configureStore</code>, open Redux DevTools — actions appear automatically!
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={1}
      title="configureStore + Provider"
      badge="Senior Essential"
      whatIsIt={<><code>configureStore()</code> is the <strong>starting point</strong> of every RTK app. It creates the Redux store, automatically adds <strong>Redux DevTools</strong>, thunk middleware, and Immer. <code>{'<Provider>'}</code> wraps your app so every component tree can access the store via hooks.</>}
      whenToUse={[
        'Once per application, at the root level (main.tsx or App.tsx)',
        'Whenever you want Redux DevTools without manually configuring enhancers',
        'When you pass your slice reducers in the `reducer:` object',
        'Provider must wrap any component that uses useSelector or useDispatch',
      ]}
      howItWorks={`import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { counterSlice } from './counterSlice';

// Creates the store + auto-adds DevTools, thunk, Immer
const store = configureStore({
  reducer: counterReducer,  // flat reducer: state = { count: 0 }
  // OR object of slices:
  // reducer: { counter: counterSlice.reducer }
});

// Wrap your app so components can read the store
<Provider store={store}>
  <App />
</Provider>`}
      liveDemo={
        <Provider store={ex.store}>
          <ErrorBoundary>
            <Demo />
          </ErrorBoundary>
        </Provider>
      }
      exerciseTitle="Migrate createStore → configureStore"
      exerciseContext={<>The file below uses the <strong>deprecated</strong> <code>createStore</code> API. Migrate it to <code>configureStore</code>. The counter above runs <strong>your</strong> exercise file — when it works, the counter will update. Open Redux DevTools to see actions appear automatically after migration.</>}
      exerciseSteps={[
        { text: 'Open exerciseStore.ts — find the deprecated createStore line', hint: 'src/lessons/01-configure-store/exerciseStore.ts' },
        { text: 'Replace the import: use configureStore from "@reduxjs/toolkit" not createStore from "redux"', hint: 'import { configureStore } from "@reduxjs/toolkit"' },
        { text: 'Replace createStore(counterReducer) with configureStore({ reducer: counterReducer })', hint: 'Keep the reducer FLAT — not nested: { reducer: counterReducer }, not { reducer: { counter: counterReducer } }' },
        { text: 'Click +/− in the demo above — verify the counter updates. Then open Redux DevTools!', hint: 'The count shows "?" if your state shape is wrong — keep reducer flat' },
      ]}
      exerciseFile="src/lessons/01-configure-store/exerciseStore.ts"
      solution={`import { configureStore } from '@reduxjs/toolkit'; // ← RTK

function counterReducer(state = { count: 0 }, action: { type: string }) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    default: return state;
  }
}

// ✅ Flat reducer — state shape: { count: number }
export const store = configureStore({ reducer: counterReducer });

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`}
      onComplete={onComplete}
    />
  );
}
