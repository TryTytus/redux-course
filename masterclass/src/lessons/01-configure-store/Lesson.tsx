import React, { useState } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO STORE (isolated) ──────────────────────────────────────────────────
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: s => { s.value += 1; },
    decrement: s => { s.value -= 1; },
    reset:     s => { s.value = 0;  },
  },
});
const demoStore = configureStore({ reducer: { counter: counterSlice.reducer } });

// ── LIVE DEMO ──────────────────────────────────────────────────────────────
function Demo() {
  const value   = useSelector((s: ReturnType<typeof demoStore.getState>) => s.counter.value);
  const dispatch = useDispatch();
  const [log, setLog]    = useState<string[]>([]);

  const fire = (action: ReturnType<typeof counterSlice.actions.increment | typeof counterSlice.actions.decrement | typeof counterSlice.actions.reset>) => {
    dispatch(action as any);
    setLog(prev => [`→ ${JSON.stringify(action)}`, ...prev].slice(0, 5));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="demo-row">
        <button className="btn-secondary" style={{ padding: '0.5rem 1.2rem' }} onClick={() => fire(counterSlice.actions.decrement())}>−</button>
        <span className="demo-value">{value}</span>
        <button className="btn-primary"   style={{ padding: '0.5rem 1.2rem' }} onClick={() => fire(counterSlice.actions.increment())}>+</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1.2rem', marginLeft: 'auto' }} onClick={() => fire(counterSlice.actions.reset())}>Reset</button>
      </div>
      {log.length > 0 && (
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>DevTools — Action Log</p>
          {log.map((l, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: i === 0 ? 'var(--success)' : 'var(--text-3)', padding: '0.15rem 0', opacity: 1 - i * 0.18 }}>{l}</div>
          ))}
        </div>
      )}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Open Redux DevTools in your browser to see these actions appear there too — <strong>for free</strong>, because we used <code>configureStore</code>.
      </p>
    </div>
  );
}

// ── LESSON ─────────────────────────────────────────────────────────────────
export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={1}
      title="configureStore + Provider"
      badge="Senior Essential"
      whatIsIt={<>
        <code>configureStore()</code> is the <strong>starting point</strong> of every RTK app. It creates the Redux store, automatically adds <strong>Redux DevTools</strong>, thunk middleware, and Immer support. <code>{'<Provider>'}</code> wraps your app so every component tree can access the store via hooks.
      </>}
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
  reducer: {
    counter: counterSlice.reducer,  // your slice goes here
  },
});

// Wrap your app so components can read the store
<Provider store={store}>
  <App />
</Provider>`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Migrate createStore → configureStore"
      exerciseContext={<>
        The file below uses the <strong>deprecated</strong> <code>createStore</code> API. Your job is to migrate it to <code>configureStore</code> from <code>@reduxjs/toolkit</code>. After migrating, open Redux DevTools — you should see actions appearing automatically!
      </>}
      exerciseSteps={[
        { text: 'Open the exercise file and read the current createStore setup', hint: 'src/lessons/01-configure-store/exerciseStore.ts' },
        { text: 'Import configureStore from "@reduxjs/toolkit" instead of createStore from "redux"', hint: 'Remove the old import, add the new one' },
        { text: 'Replace createStore(counterReducer) with configureStore({ reducer: counterReducer })', hint: 'The API is: configureStore({ reducer: yourReducer })' },
        { text: 'Open Redux DevTools in the browser — you should now see actions being tracked!', hint: 'Chrome extension: Redux DevTools' },
      ]}
      exerciseFile="src/lessons/01-configure-store/exerciseStore.ts"
      solution={`// ✅ SOLUTION
import { configureStore } from '@reduxjs/toolkit';  // ← RTK, not 'redux'

function counterReducer(state = { count: 0 }, action: { type: string }) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    default: return state;
  }
}

// ✅ configureStore replaces createStore.
// Auto-adds: Redux DevTools, redux-thunk, Immer
export const store = configureStore({
  reducer: counterReducer,
});

// Type helpers (best practice)
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`}
      onComplete={onComplete}
    />
  );
}
