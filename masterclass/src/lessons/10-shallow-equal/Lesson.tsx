import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { store, updateName, inc } from './exerciseStore'; // host store
import { Dashboard } from './Dashboard'; // ← YOUR component to fix

function Controls() {
  const dispatch = useDispatch();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          onClick={() => dispatch(inc() as any)}>
          +1 counter (unrelated to user)
        </button>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          onClick={() => dispatch(updateName('Bob Smith') as any)}>
          Change Name → user changes
        </button>
      </div>
      <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Your Dashboard component (fix it to stop over-rendering ↓)</p>
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Click "+1 counter" — Dashboard's render count should stay the same after fixing. It should only re-render when user data changes, not when counter changes.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={10} title="shallowEqual + useStore" badge="Utility"
      whatIsIt={<><code>shallowEqual</code> is a comparator for <code>useSelector</code>. By default, <code>useSelector</code> uses <code>===</code> — so returning a new object always triggers a re-render even if values are the same. <code>shallowEqual</code> compares each key/value, preventing unnecessary re-renders.</>}
      whenToUse={[
        'When your selector returns an object that is recreated each render (new reference)',
        'When you see components re-rendering even though displayed values didn\'t change',
        'Prefer createSelector for complex derived data — shallowEqual for simple object selectors',
        'useStore: rare — for imperative patterns when you can\'t use useSelector',
      ]}
      howItWorks={`import { useSelector, shallowEqual } from 'react-redux';

// ❌ Without shallowEqual — new object = re-render on every dispatch:
const user = useSelector(s => ({
  name: s.user.name,  // {} !== {} even if values are same!
  role: s.user.role,
}));

// ✅ With shallowEqual — only re-renders when VALUES change:
const user = useSelector(
  s => ({ name: s.user.name, role: s.user.role }),
  shallowEqual  // compares each key's value, not the reference
);`}
      liveDemo={
        <Provider store={store}>
          <Controls />
        </Provider>
      }
      exerciseTitle="Stop a Dashboard from Over-Rendering"
      exerciseContext={<>The Dashboard above re-renders on <strong>every</strong> action — even unrelated counter updates. Watch the "Renders:" count: clicking "+1 counter" should NOT increment it. Fix <code>Dashboard.tsx</code> by adding <code>shallowEqual</code> as the second argument to <code>useSelector</code>.</>}
      exerciseSteps={[
        { text: 'Open Dashboard.tsx — find the useSelector that returns an object', hint: 'src/lessons/10-shallow-equal/Dashboard.tsx' },
        { text: 'Import shallowEqual from "react-redux"', hint: 'import { useSelector, shallowEqual } from "react-redux"' },
        { text: 'Add shallowEqual as second argument: useSelector(selector, shallowEqual)', hint: 'That\'s literally the entire fix!' },
        { text: 'Click "+1 counter" — render count should NOT increase now', hint: 'Counter changes don\'t affect user.name/email/role values' },
      ]}
      exerciseFile="src/lessons/10-shallow-equal/Dashboard.tsx"
      solution={`import { useSelector, shallowEqual } from 'react-redux';

function Dashboard() {
  // ✅ shallowEqual: only re-renders when name, email, or role VALUE changes
  const userInfo = useSelector(
    (state: RootState) => ({
      name:  state.user.name,
      email: state.user.email,
      role:  state.user.role,
    }),
    shallowEqual  // ← the one-word fix!
  );
  // ...
}`}
      onComplete={onComplete}
    />
  );
}
