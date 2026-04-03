import React, { useRef } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { shallowEqual } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO ───────────────────────────────────────────────────────────────────
const demoSlice = createSlice({
  name: 'demo',
  initialState: { firstName: 'Alice', lastName: 'Chen', counter: 0 },
  reducers: {
    inc:      s => { s.counter++; },
    flipName: s => { s.firstName = s.firstName === 'Alice' ? 'Bob' : 'Alice'; },
  },
});
const demoStore = configureStore({ reducer: { demo: demoSlice.reducer } });
type DS = ReturnType<typeof demoStore.getState>;

// ── Without shallowEqual: re-renders when ANY state changes ────────────────
function WithoutShallowEqual() {
  // ❌ Returns new object every time — component always re-renders
  const user = useSelector((s: DS) => ({ firstName: s.demo.firstName, lastName: s.demo.lastName }));
  const renders = useRef(0);
  renders.current++;
  return (
    <div className="demo-card flash" key={renders.current} style={{ borderColor: 'rgba(239,68,68,0.4)' }}>
      <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: 'var(--error)', fontFamily: 'var(--font-mono)' }}>❌ No shallowEqual</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem' }}>{user.firstName} {user.lastName}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--error)' }}>renders: {renders.current}</span>
      </div>
      <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--text-3)' }}>Re-renders on every dispatch (new object reference each time)</p>
    </div>
  );
}

// ── With shallowEqual: only re-renders when VALUES change ─────────────────
function WithShallowEqual() {
  // ✅ shallowEqual compares values — skips re-render if values are same
  const user = useSelector(
    (s: DS) => ({ firstName: s.demo.firstName, lastName: s.demo.lastName }),
    shallowEqual
  );
  const renders = useRef(0);
  renders.current++;
  return (
    <div className="demo-card" key={renders.current} style={{ borderColor: 'rgba(16,185,129,0.4)' }}>
      <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>✅ With shallowEqual</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem' }}>{user.firstName} {user.lastName}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--success)' }}>renders: {renders.current}</span>
      </div>
      <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--text-3)' }}>Only re-renders when firstName or lastName changes</p>
    </div>
  );
}

function Demo() {
  const dispatch = useDispatch();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => dispatch(demoSlice.actions.inc() as any)}>
          +1 counter (unrelated to user)
        </button>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => dispatch(demoSlice.actions.flipName() as any)}>
          Flip name
        </button>
      </div>
      <WithoutShallowEqual />
      <WithShallowEqual />
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Click "+1 counter" — the ❌ component re-renders (new object ref), the ✅ one doesn't (values unchanged).
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={10} title="shallowEqual + useStore" badge="Utility"
      whatIsIt={<><code>shallowEqual</code> is a comparator passed to <code>useSelector</code> as a second argument. By default, <code>useSelector</code> uses <strong>reference equality</strong> (<code>===</code>) — so returning a new object always triggers a re-render. <code>shallowEqual</code> compares each key/value, preventing unnecessary re-renders. <code>useStore</code> gives you direct imperativeaccess to the store instance.</>}
      whenToUse={[
        'shallowEqual: when your selector returns an object or array that is recreated each render',
        'shallowEqual: when you see components re-rendering even though values didn\'t change',
        'useStore: rare — for imperative patterns, when you can\'t use useSelector/useDispatch',
        'Prefer createSelector for complex derived data — shallowEqual for simple object selectors',
      ]}
      howItWorks={`import { useSelector, shallowEqual, useStore } from 'react-redux';

// ❌ Without shallowEqual — new object = re-render on every dispatch:
const user = useSelector(s => ({
  name: s.user.name,   // new object reference every render!
  age: s.user.age,
}));

// ✅ With shallowEqual — only re-renders if name or age VALUE changes:
const user = useSelector(
  s => ({ name: s.user.name, age: s.user.age }),
  shallowEqual    // ← compare each key's value, not the object reference
);

// useStore — direct imperative access (use sparingly):
const store = useStore();
const snapshot = store.getState();`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Stop a Dashboard from Re-rendering on Every Action"
      exerciseContext={<>A dashboard component selects multiple user fields as an object. It re-renders on every single action dispatched anywhere in the app. Fix it with <code>shallowEqual</code>.</>}
      exerciseSteps={[
        { text: 'Open the exercise file — find the useSelector that returns an object', hint: 'src/lessons/10-shallow-equal/Dashboard.tsx' },
        { text: 'Import shallowEqual from "react-redux"', hint: 'import { useSelector, shallowEqual } from "react-redux"' },
        { text: 'Add shallowEqual as the second argument to useSelector', hint: 'useSelector(selector, shallowEqual) — that\'s all!' },
        { text: 'Verify: dispatch an unrelated action — the render count should NOT increase', hint: 'Use the render counter in the component to verify' },
      ]}
      exerciseFile="src/lessons/10-shallow-equal/Dashboard.tsx"
      solution={`import { useSelector, shallowEqual } from 'react-redux';

function Dashboard() {
  // ✅ shallowEqual prevents re-renders when object VALUES are the same
  const userInfo = useSelector(
    (state: RootState) => ({
      name:  state.user.name,
      email: state.user.email,
      role:  state.user.role,
    }),
    shallowEqual  // ← the fix!
  );

  // Only re-renders when name, email, OR role actually changes
  return <div>{userInfo.name} — {userInfo.role}</div>;
}`}
      onComplete={onComplete}
    />
  );
}
