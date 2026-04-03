import React, { useRef } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO STORE ─────────────────────────────────────────────────────────────
const demoSlice = createSlice({
  name: 'demo',
  initialState: { counterA: 0, counterB: 0, theme: 'dark' as string },
  reducers: {
    incA:      (s) => { s.counterA += 1; },
    incB:      (s) => { s.counterB += 1; },
    flipTheme: (s) => { s.theme = s.theme === 'dark' ? 'light' : 'dark'; },
  },
});
const demoStore = configureStore({ reducer: { demo: demoSlice.reducer } });
type DS = ReturnType<typeof demoStore.getState>;

// ── LIVE DEMO ──────────────────────────────────────────────────────────────
function CounterA() {
  const val = useSelector((s: DS) => s.demo.counterA);
  const renders = useRef(0);
  renders.current++;
  return (
    <div className="demo-card" style={{ borderColor: 'rgba(0,216,255,0.3)' }}>
      <p style={{ margin: '0 0 0.3rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>Component A — subscribed to counterA</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="demo-value" style={{ fontSize: '1.5rem' }}>{val}</span>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--secondary)' }}>renders: {renders.current}</span>
      </div>
    </div>
  );
}
function CounterB() {
  const val = useSelector((s: DS) => s.demo.counterB);
  const renders = useRef(0);
  renders.current++;
  return (
    <div className="demo-card" style={{ borderColor: 'rgba(255,71,133,0.3)' }}>
      <p style={{ margin: '0 0 0.3rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>Component B — subscribed to counterB</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="demo-value" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>{val}</span>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>renders: {renders.current}</span>
      </div>
    </div>
  );
}

function Demo() {
  const dispatch = useDispatch();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', borderColor: 'rgba(0,216,255,0.4)', color: 'var(--secondary)' }}
          onClick={() => dispatch(demoSlice.actions.incA() as any)}>+1 Counter A</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', borderColor: 'rgba(255,71,133,0.4)', color: 'var(--accent)' }}
          onClick={() => dispatch(demoSlice.actions.incB() as any)}>+1 Counter B</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          onClick={() => dispatch(demoSlice.actions.flipTheme() as any)}>Flip Theme</button>
      </div>
      <CounterA />
      <CounterB />
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Click "+1 Counter A" — only Component A re-renders (watch the render count). Component B is unaffected. This is <strong>selective subscription</strong>.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={3}
      title="useSelector + useDispatch"
      badge="Senior Essential"
      whatIsIt={<>
        <code>useSelector(selector)</code> subscribes a component to a specific part of state — it only re-renders when <em>that slice</em> changes. <code>useDispatch()</code> gives you the <code>dispatch</code> function so you can send actions to the store from inside any component.
      </>}
      whenToUse={[
        'useSelector: any time a component needs to READ from the Redux store',
        'useDispatch: any time a component needs to trigger a state change',
        'Prefer narrow selectors (state.user.name) over wide ones (state.user) to avoid extra re-renders',
        'Always call them at the top level of a component — never inside loops or conditionals (Rules of Hooks)',
      ]}
      howItWorks={`import { useSelector, useDispatch } from 'react-redux';
import { increment } from './counterSlice';

function Counter() {
  // Subscribes ONLY to counter.value — won't re-render for other state changes
  const value = useSelector((state: RootState) => state.counter.value);

  // Gives you the store's dispatch function
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(increment())}>
      Count: {value}
    </button>
  );
}`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Wire Up a Notification Bell"
      exerciseContext={<>
        A <code>NotificationBell</code> component shows hardcoded data. The store already has a <code>notificationsSlice</code> with items and an <code>unreadCount</code>. Your job: connect the component using <code>useSelector</code> and <code>useDispatch</code> so it reads real data and can mark notifications as read.
      </>}
      exerciseSteps={[
        { text: 'Open the exercise file — find the hardcoded data in NotificationBell', hint: 'src/lessons/03-use-selector-dispatch/NotificationBell.tsx' },
        { text: 'Import useSelector and useDispatch from "react-redux"', hint: 'import { useSelector, useDispatch } from "react-redux"' },
        { text: 'Replace the hardcoded count with: useSelector(s => s.notifications.unreadCount)', hint: 'The selector returns a number from the store' },
        { text: 'On button click, dispatch markAllRead() instead of calling a local setState', hint: 'const dispatch = useDispatch(); then dispatch(markAllRead())' },
      ]}
      exerciseFile="src/lessons/03-use-selector-dispatch/NotificationBell.tsx"
      solution={`import { useSelector, useDispatch } from 'react-redux';
import { markAllRead } from './exerciseStore';
import type { RootState } from './exerciseStore';

function NotificationBell() {
  // ✅ Read from store — only re-renders when unreadCount changes
  const unreadCount = useSelector((s: RootState) => s.notifications.unreadCount);
  const items       = useSelector((s: RootState) => s.notifications.items);

  // ✅ Get dispatch function
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(markAllRead())}>
        🔔 {unreadCount > 0 ? \`\${unreadCount} unread\` : 'All read'}
      </button>
      {items.map(n => <div key={n.id}>{n.message}</div>)}
    </div>
  );
}`}
      onComplete={onComplete}
    />
  );
}
