import React, { useState } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

const demoSlice = createSlice({
  name: 'demo', initialState: { count: 0, user: 'Alice' },
  reducers: { inc: s => { s.count++; }, setUser: (s, a: { payload: string }) => { s.user = a.payload; } },
});
const demoStore = configureStore({ reducer: { demo: demoSlice.reducer } });

function Demo() {
  const dispatch = useDispatch();
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [snapCount, setSnapCount] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => dispatch(demoSlice.actions.inc() as any)}>dispatch inc()</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => dispatch(demoSlice.actions.setUser('Bob') as any)}>dispatch setUser(Bob)</button>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => { setSnapshot(JSON.stringify(demoStore.getState(), null, 2)); setSnapCount(c => c + 1); }}>
          📸 getState() Snapshot
        </button>
      </div>
      {snapshot && (
        <div>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Snapshot #{snapCount} — taken at this moment:</p>
          <pre style={{ margin: 0, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--success)' }}>{snapshot}</pre>
        </div>
      )}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Dispatch a few actions, then take a snapshot. Notice: the snapshot is a <strong>point-in-time read</strong> — it doesn't subscribe or update automatically.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={6} title="getState" badge="Senior Essential"
      whatIsIt={<><code>store.getState()</code> returns the <strong>current state snapshot</strong> as a plain object. Unlike <code>useSelector</code>, it does NOT subscribe — it reads once and that's it. No re-renders triggered. Used in middleware, utility functions, and non-React code.</>}
      whenToUse={[
        'Inside middleware: read state after an action fires',
        'In async thunks: access state to make conditional logic',
        'In non-React code (e.g. a WebSocket handler, localStorage sync)',
        'Never use it inside React components — use useSelector instead',
      ]}
      howItWorks={`// Access the store outside React:
import { store } from './store';

// Read current state (one-time snapshot, no subscription):
const state = store.getState();
console.log(state.cart.items); // current items

// Common use — inside middleware:
const loggerMiddleware = store => next => action => {
  const stateBefore = store.getState();
  next(action);
  const stateAfter = store.getState();
  console.log('Before:', stateBefore);
  console.log('After:', stateAfter);
};`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Build a Logger Middleware with getState"
      exerciseContext={<>The exercise file has a skeleton middleware that logs every action. Complete it using <code>getState()</code> to also log the state before and after each action.</>}
      exerciseSteps={[
        { text: 'Open the exercise file — find the incomplete loggerMiddleware', hint: 'src/lessons/06-get-state/exerciseMiddleware.ts' },
        { text: 'Call store.getState() BEFORE next(action) to capture the previous state', hint: 'const prevState = store.getState();' },
        { text: 'Call next(action) to pass the action along', hint: 'This is like "calling the next middleware" (or the reducer)' },
        { text: 'Call store.getState() AFTER next(action) to capture the next state', hint: 'const nextState = store.getState(); — state has now changed' },
        { text: 'Add the middleware to configureStore via the middleware option', hint: 'middleware: (getDefault) => getDefault().concat(loggerMiddleware)' },
      ]}
      exerciseFile="src/lessons/06-get-state/exerciseMiddleware.ts"
      solution={`const loggerMiddleware = (store) => (next) => (action) => {
  // ✅ Read state BEFORE action is processed
  const prevState = store.getState();
  console.group(\`Action: \${action.type}\`);
  console.log('Previous state:', prevState);
  
  // ✅ Pass action to next middleware (or reducer)
  const result = next(action);
  
  // ✅ Read state AFTER action was processed
  const nextState = store.getState();
  console.log('Next state:', nextState);
  console.groupEnd();
  return result;
};

// In configureStore:
const store = configureStore({
  reducer: { ... },
  middleware: (getDefault) => getDefault().concat(loggerMiddleware),
});`}
      onComplete={onComplete}
    />
  );
}
