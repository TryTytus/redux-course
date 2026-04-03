import React, { useState } from 'react';
import { configureStore, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';

// ── DEMO ───────────────────────────────────────────────────────────────────
interface Contact { id: number; name: string; email: string; }
const adapter = createEntityAdapter<Contact>();
const contactsSlice = createSlice({
  name: 'contacts',
  initialState: adapter.getInitialState(),
  reducers: {
    addContact:    adapter.addOne,
    removeContact: adapter.removeOne,
    updateContact: adapter.updateOne,
  },
});
const demoStore = configureStore({ reducer: { contacts: contactsSlice.reducer } });
type DS = ReturnType<typeof demoStore.getState>;
const { selectAll } = adapter.getSelectors((s: DS) => s.contacts);

let nextId = 1;
const SAMPLE = ['Alice Chen', 'Bob Kowalski', 'Carol White', 'David Park'];

function Demo() {
  const contacts = useSelector(selectAll);
  const dispatch  = useDispatch();
  const [showRaw, setShowRaw] = useState(false);
  const rawState = demoStore.getState().contacts;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          onClick={() => { const n = SAMPLE[nextId % SAMPLE.length]; dispatch(contactsSlice.actions.addContact({ id: nextId++, name: n, email: `${n.split(' ')[0].toLowerCase()}@test.com` }) as any); }}>
          + Add Contact
        </button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          onClick={() => setShowRaw(s => !s)}>
          {showRaw ? 'Hide' : 'Show'} Raw Normalized State
        </button>
      </div>
      {SAMPLE.length > 0 && contacts.map(c => (
        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '0.85rem' }}>
          <div><strong>{c.name}</strong> <span style={{ color: 'var(--text-3)' }}>· {c.email}</span></div>
          <button style={{ color: 'var(--error)', fontSize: '0.8rem' }} onClick={() => dispatch(contactsSlice.actions.removeContact(c.id) as any)}>✕</button>
        </div>
      ))}
      {contacts.length === 0 && <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.82rem' }}>No contacts — add some</p>}
      {showRaw && (
        <pre style={{ margin: 0, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(118,74,188,0.3)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#e2e8f0', overflowX: 'auto' }}>
          {JSON.stringify(rawState, null, 2)}
        </pre>
      )}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Click "Show Raw Normalized State" — see how <code>ids</code> is an array of keys and <code>entities</code> is a dictionary. O(1) lookups!
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={7} title="createEntityAdapter" badge="Senior Essential"
      whatIsIt={<><code>createEntityAdapter</code> manages a <strong>normalized</strong> collection: instead of an array, state uses <code>{'{ ids: [], entities: {} }'}</code>. This gives you O(1) lookup by id, built-in CRUD operations (<code>addOne</code>, <code>removeOne</code>, <code>updateOne</code>, <code>setAll</code>...), and pre-built selectors.</>}
      whenToUse={[
        'Managing lists of items that have unique IDs: users, contacts, posts, products',
        'When you frequently look up items by ID (O(1) vs O(n) for arrays)',
        'When multiple parts of the app reference the same items (normalized = single source)',
        'When you need sorting, pagination, or derived views of the same data',
      ]}
      howItWorks={`import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

// 1. Create an adapter for your entity type
const adapter = createEntityAdapter<User>();

// 2. Use it to create the slice
const usersSlice = createSlice({
  name: 'users',
  initialState: adapter.getInitialState(), // { ids: [], entities: {} }
  reducers: {
    addUser:    adapter.addOne,    // adds { id, ...fields }
    removeUser: adapter.removeOne, // removes by id
    updateUser: adapter.updateOne, // {id, changes: {...}} patch update
    setUsers:   adapter.setAll,    // replace entire collection
  },
});

// 3. Get pre-built selectors:
const { selectAll, selectById } = adapter.getSelectors(
  (state: RootState) => state.users
);`}
      liveDemo={<Provider store={demoStore}><Demo /></Provider>}
      exerciseTitle="Rewrite a Plain Array Slice with createEntityAdapter"
      exerciseContext={<>The exercise file has a contacts slice backed by a plain <strong>array</strong>. It's missing fast lookups and has duplicate CRUD logic. Rewrite it using <code>createEntityAdapter</code>.</>}
      exerciseSteps={[
        { text: 'Open the exercise file — read the current array-based slice', hint: 'src/lessons/07-entity-adapter/exerciseSlice.ts' },
        { text: 'Create an adapter: const adapter = createEntityAdapter<Contact>()', hint: 'Import createEntityAdapter from "@reduxjs/toolkit"' },
        { text: 'Replace initialState with adapter.getInitialState()', hint: 'This sets up the { ids: [], entities: {} } shape' },
        { text: 'Replace the reducer functions with adapter.addOne, adapter.removeOne, adapter.updateOne', hint: 'They have the same names — just point to the adapter methods' },
        { text: 'Export selectors using adapter.getSelectors()', hint: 'const { selectAll, selectById } = adapter.getSelectors(s => s.contacts)' },
      ]}
      exerciseFile="src/lessons/07-entity-adapter/exerciseSlice.ts"
      solution={`const adapter = createEntityAdapter<Contact>();

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: adapter.getInitialState(), // ✅ { ids: [], entities: {} }
  reducers: {
    addContact:    adapter.addOne,    // ✅ no array.push needed
    removeContact: adapter.removeOne, // ✅ no array.filter needed
    updateContact: adapter.updateOne, // ✅ no array.map needed
  },
});

// ✅ Pre-built, memoized selectors:
export const { selectAll: selectAllContacts, selectById: selectContactById }
  = adapter.getSelectors((state: RootState) => state.contacts);`}
      onComplete={onComplete}
    />
  );
}
