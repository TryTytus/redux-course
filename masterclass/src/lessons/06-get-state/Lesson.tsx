import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import * as ex from './exerciseMiddleware'; // ← YOUR middleware file

// Patch console.group to capture middleware logs in the UI
const consoleLogs: string[] = [];
const origGroup = console.group.bind(console);
const origLog   = console.log.bind(console);
console.group = (...args: any[]) => { consoleLogs.unshift(`[group] ${args.join(' ')}`); origGroup(...args); };
console.log   = (...args: any[]) => {
  if (consoleLogs.length && !consoleLogs[0].startsWith('[log]')) {
    const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    consoleLogs.splice(1, 0, `  [log] ${str}`);
  }
  origLog(...args);
};

function Demo() {
  const count  = useSelector((s: any) => s?.counter?.value ?? 0);
  const label  = useSelector((s: any) => s?.counter?.label ?? '');
  const dispatch = useDispatch();
  const [logs, setLogs] = useState<string[]>([]);

  const fire = (action: any) => {
    dispatch(action);
    // Capture latest logs after dispatch
    setLogs([...consoleLogs.slice(0, 8)]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="demo-row">
        <button className="btn-secondary" style={{ padding: '0.5rem 1.2rem' }} onClick={() => fire(ex.decrement())}>−</button>
        <span className="demo-value">{count}</span>
        <button className="btn-primary" style={{ padding: '0.5rem 1.2rem' }} onClick={() => fire(ex.increment())}>+</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', marginLeft: 'auto' }}
          onClick={() => fire(ex.setLabel('My Counter'))}>Set Label</button>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', minHeight: '80px' }}>
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
          Middleware Console Output {logs.length === 0 ? '← dispatch an action to see output' : '↓'}
        </p>
        {logs.length === 0 && <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>Complete the middleware exercise to see before/after state logged here!</p>}
        {logs.map((l, i) => (
          <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: l.includes('[group]') ? 'var(--secondary)' : 'var(--text-2)', padding: '0.1rem 0', paddingLeft: l.includes('[log]') ? '1rem' : '0' }}>
            {l.replace(/\[group\] |  \[log\] /, '')}
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Implement the middleware in <code>exerciseMiddleware.ts</code> using <code>store.getState()</code> — then dispatch actions and see before/after state appear above.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={6} title="getState" badge="Senior Essential"
      whatIsIt={<><code>store.getState()</code> returns the <strong>current state snapshot</strong> as a plain object. Unlike <code>useSelector</code>, it does NOT subscribe — it reads once and that's it. Used in middleware, utility functions, and non-React code.</>}
      whenToUse={[
        'Inside middleware: read state after an action fires',
        'In async thunks: access state for conditional logic',
        'In non-React code (WebSocket handlers, localStorage sync)',
        'Never in React components — use useSelector instead!',
      ]}
      howItWorks={`// Middleware signature: store => next => action => result
const loggerMiddleware = (store) => (next) => (action) => {
  const before = store.getState(); // ← reads state NOW
  const result = next(action);     // ← pass to reducer
  const after  = store.getState(); // ← reads new state
  console.log('Before:', before);
  console.log('After:', after);
  return result;
};

// Register in configureStore:
configureStore({
  reducer: ...,
  middleware: (get) => get().concat(loggerMiddleware),
});`}
      liveDemo={
        <Provider store={ex.store}>
          <ErrorBoundary>
            <Demo />
          </ErrorBoundary>
        </Provider>
      }
      exerciseTitle="Complete the Logger Middleware"
      exerciseContext={<>The middleware panel above shows blank output. Open <code>exerciseMiddleware.ts</code> and complete the <code>loggerMiddleware</code> using <code>store.getState()</code>. Then add it to <code>configureStore</code>. When done, dispatching any action will show before/after state in the panel above!</>}
      exerciseSteps={[
        { text: 'Open exerciseMiddleware.ts — find the skeleton middleware', hint: 'src/lessons/06-get-state/exerciseMiddleware.ts' },
        { text: 'Step 1: const prevState = store.getState() — capture state BEFORE action', hint: 'Call this BEFORE next(action)' },
        { text: 'Step 2: const result = next(action) — pass action to reducer', hint: 'This updates the state!' },
        { text: 'Step 3: store.getState() AGAIN to capture state AFTER the action', hint: 'State has now changed — this is the new state' },
        { text: 'Step 4: Add the middleware to configureStore via the middleware option', hint: 'middleware: (getDefault) => getDefault().concat(loggerMiddleware)' },
      ]}
      exerciseFile="src/lessons/06-get-state/exerciseMiddleware.ts"
      solution={`const loggerMiddleware = (store) => (next) => (action) => {
  const prevState = store.getState(); // ← before
  console.group(\`Action: \${action.type}\`);
  console.log('Before:', prevState);
  const result = next(action);        // ← reducer runs
  const nextState = store.getState(); // ← after
  console.log('After:', nextState);
  console.groupEnd();
  return result;
};

// In configureStore:
middleware: (getDefault) => getDefault().concat(loggerMiddleware)`}
      onComplete={onComplete}
    />
  );
}
