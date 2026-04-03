import React, { useRef } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { store } from './exerciseStore';
import { NotificationBell } from './NotificationBell'; // ← the component YOU fix
import { addNotification } from './exerciseStore';

// Render counter to show selective re-rendering
function RenderCounter({ label, color }: { label: string; color: string }) {
  const renders = useRef(0);
  renders.current++;
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color }}>
      {label} renders: {renders.current}
    </span>
  );
}

function Controls() {
  const dispatch = useDispatch();
  const rawItems = useSelector((s: any) => s?.notifications?.items ?? []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          onClick={() => dispatch(addNotification('🆕 New notification added!') as any)}>
          Add Notification
        </button>
        <RenderCounter label="Controls" color="var(--text-3)" />
      </div>
      <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Your NotificationBell component (fix it below ↓):</p>
        <ErrorBoundary>
          <NotificationBell />
        </ErrorBoundary>
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 The bell shows <strong>hardcoded data</strong> right now. Fix <code>NotificationBell.tsx</code> to use <code>useSelector</code> + <code>useDispatch</code> — then it will show real store data!
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
      whatIsIt={<><code>useSelector(selector)</code> subscribes a component to a specific part of state and only re-renders when <em>that slice</em> changes. <code>useDispatch()</code> gives you the <code>dispatch</code> function to send actions from any component.</>}
      whenToUse={[
        'useSelector: any time a component needs to READ from store',
        'useDispatch: any time a component needs to trigger a state change',
        'Prefer narrow selectors (state.user.name) to avoid extra re-renders',
        'Always call them at top-level of component — never inside loops (Rules of Hooks)',
      ]}
      howItWorks={`import { useSelector, useDispatch } from 'react-redux';
import { markAllRead } from './notificationsSlice';

function NotificationBell() {
  // Subscribes to a specific slice — won't re-render for other changes
  const count = useSelector((state: RootState) => state.notifications.unreadCount);
  const items = useSelector((state: RootState) => state.notifications.items);

  // Get dispatch to send actions
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(markAllRead())}>
      🔔 {count} unread
    </button>
  );
}`}
      liveDemo={
        <Provider store={store}>
          <Controls />
        </Provider>
      }
      exerciseTitle="Wire Up NotificationBell"
      exerciseContext={<>The <code>NotificationBell</code> above shows <strong>hardcoded data</strong>. Open <code>NotificationBell.tsx</code> and wire it to the store using <code>useSelector</code> and <code>useDispatch</code>. When done, clicking "Add Notification" will update the bell.</>}
      exerciseSteps={[
        { text: 'Open NotificationBell.tsx — read the hardcoded values', hint: 'src/lessons/03-use-selector-dispatch/NotificationBell.tsx' },
        { text: 'Import useSelector and useDispatch from "react-redux"', hint: 'import { useSelector, useDispatch } from "react-redux"' },
        { text: 'Replace the hardcoded unreadCount with useSelector(s => s.notifications.unreadCount)', hint: 'Also replace the hardcoded items array' },
        { text: 'Replace handleMarkRead to dispatch(markAllRead()) instead of console.log', hint: 'Import markAllRead from "./exerciseStore"' },
      ]}
      exerciseFile="src/lessons/03-use-selector-dispatch/NotificationBell.tsx"
      solution={`import { useSelector, useDispatch } from 'react-redux';
import { markAllRead, addNotification } from './exerciseStore';

function NotificationBell() {
  const unreadCount = useSelector((s: any) => s.notifications.unreadCount);
  const items = useSelector((s: any) => s.notifications.items);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(markAllRead())}>
        🔔 {unreadCount > 0 ? \`\${unreadCount} unread\` : 'All read'}
      </button>
      {items.map((n: any) => <div key={n.id}>{n.message}</div>)}
    </div>
  );
}`}
      onComplete={onComplete}
    />
  );
}
