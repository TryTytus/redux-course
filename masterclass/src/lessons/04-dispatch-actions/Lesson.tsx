import React, { useState } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO STORE ─────────────────────────────────────────────────────────────
const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [] as { id: number; text: string; done: boolean }[] },
  reducers: {
    addTodo:    (s, a: { payload: string }) => { s.items.push({ id: Date.now(), text: a.payload, done: false }); },
    toggleTodo: (s, a: { payload: number }) => { const t = s.items.find(t => t.id === a.payload); if (t) t.done = !t.done; },
  },
});
const demoStore = configureStore({ reducer: { todos: todosSlice.reducer } });
type DS = ReturnType<typeof demoStore.getState>;

// ── LIVE DEMO ──────────────────────────────────────────────────────────────
function Demo() {
  const items    = useSelector((s: DS) => s.todos.items);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [log, setLog]   = useState<{ type: string; payload: unknown }[]>([]);

  const fire = (action: { type: string; payload?: unknown }) => {
    dispatch(action as any);
    setLog(prev => [action, ...prev].slice(0, 4));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <form style={{ display: 'flex', gap: '0.5rem' }} onSubmit={e => { e.preventDefault(); if (text) { fire(todosSlice.actions.addTodo(text)); setText(''); } }}>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="New todo..." style={{ flex: 1, fontSize: '0.85rem' }} />
        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>Dispatch addTodo</button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {items.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', cursor: 'pointer' }}
            onClick={() => fire(todosSlice.actions.toggleTodo(t.id))}>
            <span style={{ color: t.done ? 'var(--success)' : 'var(--text-3)', fontSize: '1rem' }}>{t.done ? '✓' : '○'}</span>
            <span style={{ fontSize: '0.85rem', textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-3)' : 'var(--text-1)' }}>{t.text}</span>
          </div>
        ))}
        {items.length === 0 && <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.82rem' }}>Add a todo above</p>}
      </div>
      {log.length > 0 && (
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem' }}>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Action Stream ↓</p>
          {log.map((a, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: i === 0 ? 'var(--success)' : 'var(--text-3)', opacity: 1 - i * 0.2, padding: '0.1rem 0' }}>
              {`{ type: "${a.type}", payload: ${JSON.stringify(a.payload)} }`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={4}
      title="dispatch + Actions"
      badge="Senior Essential"
      whatIsIt={<>
        An <strong>action</strong> is a plain JS object with a <code>type</code> field (and optional <code>payload</code>). <code>dispatch(action)</code> is the <strong>only</strong> way to update state — it sends the action through all middleware and then to the reducer. Action creators (from <code>createSlice</code>) are just functions that return these objects.
      </>}
      whenToUse={[
        'Any time something happens in the UI that should update state',
        'Never call a reducer directly — always go through dispatch()',
        'Action types are strings: "sliceName/reducerName" (e.g. "todos/addTodo")',
        'Action creators make dispatch calls type-safe and self-documenting',
      ]}
      howItWorks={`// An action is just a plain object:
const action = { type: 'todos/addTodo', payload: 'Buy milk' };

// dispatch() sends it through the store:
dispatch(action);

// Action creators (from createSlice) build that object for you:
dispatch(addTodo('Buy milk'));
// dispatches: { type: 'todos/addTodo', payload: 'Buy milk' }

// You can also inspect what an action creator returns:
console.log(addTodo('Buy milk'));
// → { type: 'todos/addTodo', payload: 'Buy milk' }`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Fix a Component That Bypasses dispatch()"
      exerciseContext={<>
        The exercise file has a <code>TodoApp</code> component that calls <code>todoReducer(state, action)</code> <strong>directly</strong> — completely bypassing the store and dispatch. This means React never re-renders and DevTools sees nothing. Fix it to use <code>dispatch()</code>.
      </>}
      exerciseSteps={[
        { text: 'Open the exercise file and find where the reducer is called directly', hint: 'src/lessons/04-dispatch-actions/exerciseStore.ts — look for todoReducer(...)' },
        { text: 'Import the store and action creators', hint: 'import { store, addTodo, toggleTodo } from "./exerciseStore"' },
        { text: 'Replace all direct reducer calls with store.dispatch(actionCreator(...))', hint: 'store.dispatch(addTodo(text)) — never call the reducer function yourself' },
        { text: 'Verify in Redux DevTools that actions now appear in the action log', hint: 'Every dispatch() call creates an entry in DevTools' },
      ]}
      exerciseFile="src/lessons/04-dispatch-actions/exerciseStore.ts"
      solution={`// ✅ CORRECT: always go through dispatch
import { store } from './exerciseStore';
import { addTodo, toggleTodo } from './exerciseStore';

// In your component:
const dispatch = useDispatch();

// ✅ This goes through all middleware + notifies subscribers:
dispatch(addTodo('Buy milk'));
// dispatches: { type: 'todos/addTodo', payload: 'Buy milk' }

dispatch(toggleTodo(1));
// dispatches: { type: 'todos/toggleTodo', payload: 1 }

// ❌ NEVER do this — bypasses store, no re-renders, no DevTools:
// todoReducer(state, { type: 'todos/addTodo', payload: 'Buy milk' });`}
      onComplete={onComplete}
    />
  );
}
