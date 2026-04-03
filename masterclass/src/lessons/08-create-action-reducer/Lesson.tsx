import React, { useState } from 'react';
import { configureStore, createAction, createReducer, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO: createAction + createReducer ────────────────────────────────────
const inc   = createAction<number>('counter/increment');
const dec   = createAction<number>('counter/decrement');
const reset = createAction('counter/reset');

const counterReducer = createReducer(0, builder => {
  builder
    .addCase(inc,   (state, action) => state + action.payload)
    .addCase(dec,   (state, action) => state - action.payload)
    .addCase(reset, ()              => 0);
});
const demoStore = configureStore({ reducer: { counter: counterReducer } });
type DS = ReturnType<typeof demoStore.getState>;

function Demo() {
  const count   = useSelector((s: DS) => s.counter);
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const fire = (action: ReturnType<typeof inc | typeof dec | typeof reset>) => {
    dispatch(action as any);
    setLastAction(JSON.stringify(action));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }} onClick={() => fire(dec(step))}>−{step}</button>
        <span className="demo-value">{count}</span>
        <button className="btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }} onClick={() => fire(inc(step))}>+{step}</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>step:</span>
          <input type="number" value={step} onChange={e => setStep(Number(e.target.value))} min={1} style={{ width: '50px', textAlign: 'center', fontSize: '0.85rem' }} />
        </div>
        <button className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }} onClick={() => fire(reset())}>Reset</button>
      </div>
      {lastAction && (
        <div style={{ padding: '0.6rem 0.9rem', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Last action dispatched:</p>
          <code style={{ fontSize: '0.8rem', color: 'var(--success)', background: 'none' }}>{lastAction}</code>
        </div>
      )}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 <code>createAction</code> produces typed action creators. <code>createReducer</code> + builder is type-safe — no more <code>action.type === "..."</code> string comparisons.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={8} title="createAction + createReducer" badge="Utility"
      whatIsIt={<><code>createAction(type)</code> creates a typed action creator. <code>createReducer(initialState, builder)</code> builds a reducer using a <strong>builder pattern</strong> (type-safe <code>addCase</code> calls) instead of a <code>switch/case</code>. These are the lower-level primitives that <code>createSlice</code> uses internally.</>}
      whenToUse={[
        'When migrating an existing vanilla reducer to RTK without full createSlice rewrite',
        'When you need to handle actions from multiple slices in one reducer (addMatcher)',
        'When fine-grained control over the reducer build process is needed',
        'Usually you prefer createSlice — but knowing these fundamentals matters',
      ]}
      howItWorks={`// createAction — makes a typed action creator:
const increment = createAction<number>('counter/increment');
increment(5);
// → { type: 'counter/increment', payload: 5 }

// createReducer — builder pattern (type-safe):
const counterReducer = createReducer(0, builder => {
  builder
    .addCase(increment, (state, action) => state + action.payload)
    .addCase(decrement, (state, action) => state - action.payload)
    .addDefaultCase((state) => state); // catch-all
});

// addMatcher — handle multiple action types:
builder.addMatcher(
  (action) => action.type.endsWith('/pending'),
  (state) => { state.loading = true; }
);`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Migrate a switch/case Reducer to Builder Pattern"
      exerciseContext={<>The exercise file has an old-school <code>switch/case</code> reducer for a theme toggle. Rewrite it using <code>createAction</code> + <code>createReducer</code> with the builder pattern.</>}
      exerciseSteps={[
        { text: 'Open the exercise file — read the switch/case reducer', hint: 'src/lessons/08-create-action-reducer/exerciseReducer.ts' },
        { text: 'Use createAction to define setTheme and resetTheme action creators', hint: 'const setTheme = createAction<string>("theme/setTheme")' },
        { text: 'Rewrite the reducer using createReducer and builder.addCase()', hint: 'createReducer(initialState, builder => { builder.addCase(setTheme, (state, action) => ...) })' },
        { text: 'Test it: setTheme("light") should produce { type: "theme/setTheme", payload: "light" }', hint: 'console.log(setTheme("light")) to verify the action object shape' },
      ]}
      exerciseFile="src/lessons/08-create-action-reducer/exerciseReducer.ts"
      solution={`import { createAction, createReducer } from '@reduxjs/toolkit';

// ✅ Typed action creators
const setTheme   = createAction<string>('theme/setTheme');
const resetTheme = createAction('theme/reset');

interface ThemeState { current: string; previous: string | null; }
const initialState: ThemeState = { current: 'dark', previous: null };

// ✅ Builder pattern — fully type-safe
const themeReducer = createReducer(initialState, builder => {
  builder
    .addCase(setTheme, (state, action) => {
      state.previous = state.current;
      state.current  = action.payload;
    })
    .addCase(resetTheme, state => {
      state.current  = 'dark';
      state.previous = null;
    });
});

export { setTheme, resetTheme, themeReducer };`}
      onComplete={onComplete}
    />
  );
}
