// ══════════════════════════════════════════════════════════════
// LESSON 10 EXERCISE — shallowEqual
// ══════════════════════════════════════════════════════════════
// SCENARIO: A Dashboard component re-renders on EVERY action
// dispatched in the app, even unrelated ones. Fix it with shallowEqual.
// ══════════════════════════════════════════════════════════════
import React, { useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
// ❌ TODO: also import shallowEqual from 'react-redux'

interface RootState {
  user: { name: string; email: string; role: string; };
  counter: { value: number; };
}

export function Dashboard() {
  const renderCount = useRef(0);
  renderCount.current++;

  // ❌ PROBLEM: Returns a NEW object on every call.
  //    Default equality check: {} !== {} → always re-renders!
  const userInfo = useSelector((state: RootState) => ({
    name:  state.user.name,
    email: state.user.email,
    role:  state.user.role,
  }), shallowEqual);
  // ❌ TODO: Pass shallowEqual as the second argument above

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>Dashboard</h3>
        <span style={{ fontFamily: 'monospace', color: 'red', fontSize: '0.85rem' }}>
          Renders: {renderCount.current}  {/* should stay low! */}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem' }}>{userInfo.name} · {userInfo.email} · {userInfo.role}</p>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════
// YOUR TASK:
// 1. Import shallowEqual from 'react-redux'
// 2. Pass it as the second argument: useSelector(selector, shallowEqual)
// 3. Dispatch unrelated actions (e.g. counter.inc) — render count shouldn't grow
//
// WHY IT WORKS:
// Without shallowEqual: { name: 'Alice' } !== { name: 'Alice' } (new reference)
// With shallowEqual:    { name: 'Alice' } == { name: 'Alice' } (values match → skip)
// ══════════════════════════════════════════════════════════════
// ✅ DONE WHEN: Dispatching counter actions doesn't increment the render count
