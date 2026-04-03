import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import * as ex from './exerciseStore'; // ← YOUR exercise file

function Demo() {
  const items    = useSelector((s: any) => s?.todos?.items ?? []);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [log, setLog]   = useState<string[]>([]);

  const fire = (action: any) => {
    dispatch(action);
    setLog(prev => [JSON.stringify(action), ...prev].slice(0, 4));
  };

  const handleAdd = () => {
    if (!text.trim()) return;
    fire(ex.addTodo(text));
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <form style={{ display: 'flex', gap: '0.5rem' }} onSubmit={e => { e.preventDefault(); handleAdd(); }}>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="What to do..." style={{ flex: 1, fontSize: '0.85rem' }} />
        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>dispatch addTodo</button>
      </form>

      {items.map((t: any) => (
        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', cursor: 'pointer' }}
          onClick={() => fire(ex.toggleTodo(t.id))}>
          <span style={{ color: t.done ? 'var(--success)' : 'var(--text-3)', fontSize: '1rem' }}>{t.done ? '✓' : '○'}</span>
          <span style={{ fontSize: '0.85rem', flex: 1, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-3)' : 'var(--text-1)' }}>{t.text}</span>
          <button style={{ color: 'var(--text-3)', fontSize: '0.8rem' }} onClick={e => { e.stopPropagation(); fire(ex.removeTodo(t.id)); }}>✕</button>
        </div>
      ))}
      {items.length === 0 && <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.82rem' }}>Add a todo above</p>}

      {log.length > 0 && (
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem' }}>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Action Stream ↓</p>
          {log.map((l, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: i === 0 ? 'var(--success)' : 'var(--text-3)', opacity: 1 - i * 0.2 }}>{l}</div>
          ))}
        </div>
      )}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 This demo uses <strong>your</strong> <code>exerciseStore.ts</code>. The exercise file shows a broken pattern — <em>read it</em> and understand why calling the reducer directly is wrong.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={4}
      title="dispatch + Actions"
      badge="Senior Essential"
      whatIsIt={<>An <strong>action</strong> is a plain JS object with a <code>type</code> field (and optional <code>payload</code>). <code>dispatch(action)</code> is the <strong>only</strong> way to update state. Action creators (from <code>createSlice</code>) are functions that build these objects for you.</>}
      whenToUse={[
        'Any time something in the UI should change state',
        'Never call a reducer directly — always dispatch()',
        'Action types follow "sliceName/reducerName" format (e.g. "todos/addTodo")',
        'Action creators make dispatch calls type-safe and self-documenting',
      ]}
      howItWorks={`// An action is a plain object:
const action = { type: 'todos/addTodo', payload: 'Buy milk' };
dispatch(action);

// Action creators (from createSlice) build that object:
dispatch(addTodo('Buy milk'));
// dispatches: { type: 'todos/addTodo', payload: 'Buy milk' }

// ❌ NEVER call reducer directly — bypasses everything:
// todosSlice.reducer(state, addTodo('Buy milk')); ← wrong!`}
      liveDemo={
        <Provider store={ex.store}>
          <ErrorBoundary>
            <Demo />
          </ErrorBoundary>
        </Provider>
      }
      exerciseTitle="Understand Why Direct Reducer Calls Are Wrong"
      exerciseContext={<>Open the exercise file and read the broken pattern in the comments. The store and action creators are correct — the exercise explains WHY you should never call the reducer directly. The demo above uses <code>dispatch()</code> correctly — compare it to the broken comment pattern in the file.</>}
      exerciseSteps={[
        { text: 'Open exerciseStore.ts and read the broken pattern in the comments', hint: 'src/lessons/04-dispatch-actions/exerciseStore.ts' },
        { text: 'Look at the Demo above — notice it uses dispatch(addTodo(text)) not reducer directly', hint: 'dispatch() goes through middleware, notifies subscribers, updates DevTools' },
        { text: 'In the demo, add 3 todos. Open Redux DevTools — you see 3 actions logged', hint: 'Each dispatch() = one action in the DevTools timeline' },
        { text: 'What happens if you call the reducer directly? No re-render, no DevTools, no middleware!', hint: 'That\'s why dispatch() is the ONLY correct way' },
      ]}
      exerciseFile="src/lessons/04-dispatch-actions/exerciseStore.ts"
      solution={`// ✅ ALWAYS use dispatch:
const dispatch = useDispatch();
dispatch(addTodo('Buy milk'));
// → notifies all subscribers
// → runs through middleware
// → appears in Redux DevTools
// → React re-renders components subscribed to todos

// ❌ NEVER do this:
todosSlice.reducer(state, addTodo('Buy milk'));
// → Returns new state object that nobody uses
// → No subscribers notified
// → No DevTools entry
// → No React re-render`}
      onComplete={onComplete}
    />
  );
}
