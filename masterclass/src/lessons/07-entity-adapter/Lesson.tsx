import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import * as ex from './exerciseSlice'; // ← YOUR exercise file

let nextId = 1;
const NAMES = ['Alice Chen', 'Bob Kowalski', 'Carol White', 'David Park'];

function Demo() {
  const contacts = useSelector((s: any) => {
    try { return ex.selectAllContacts(s); } catch { return s?.contacts?.items ?? []; }
  });
  const dispatch = useDispatch();
  const [showRaw, setShowRaw] = useState(false);
  const rawState = ex.store.getState()?.contacts;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          onClick={() => {
            const name = NAMES[nextId % NAMES.length];
            dispatch(ex.addContact({ id: nextId++, name, email: `${name.split(' ')[0].toLowerCase()}@test.com` }) as any);
          }}>
          + Add Contact
        </button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          onClick={() => setShowRaw(s => !s)}>
          {showRaw ? 'Hide' : 'Show'} Raw State
        </button>
      </div>

      {(contacts ?? []).map((c: any) => (
        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '0.85rem' }}>
          <div><strong>{c.name}</strong> <span style={{ color: 'var(--text-3)' }}>· {c.email}</span></div>
          <button style={{ color: 'var(--error)', fontSize: '0.8rem' }} onClick={() => dispatch(ex.removeContact(c.id) as any)}>✕</button>
        </div>
      ))}
      {(!contacts || contacts.length === 0) && <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.82rem' }}>No contacts yet</p>}

      {showRaw && (
        <pre style={{ margin: 0, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(118,74,188,0.3)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#e2e8f0', overflowX: 'auto' }}>
          {JSON.stringify(rawState, null, 2)}
        </pre>
      )}
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Show Raw State before and after implementing <code>createEntityAdapter</code>. Before: <code>{'{ items: [...] }'}</code>. After: <code>{'{ ids: [...], entities: {...} }'}</code>.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={7} title="createEntityAdapter" badge="Senior Essential"
      whatIsIt={<><code>createEntityAdapter</code> manages a <strong>normalized</strong> collection: instead of an array, state becomes <code>{'{ ids: [], entities: {} }'}</code>. O(1) lookup by id, built-in CRUD operations, and pre-built selectors — all generated automatically.</>}
      whenToUse={[
        'Managing collections of items with unique IDs (users, contacts, posts)',
        'When you need fast id-based lookup (O(1) instead of O(n) with arrays)',
        'When multiple parts of the app reference the same items',
        'When you need sorting/pagination backed by a normalized store',
      ]}
      howItWorks={`const adapter = createEntityAdapter<Contact>();

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: adapter.getInitialState(), // { ids: [], entities: {} }
  reducers: {
    addContact:    adapter.addOne,    // no push() needed
    removeContact: adapter.removeOne, // no filter() needed
    updateContact: adapter.updateOne, // no map() needed
  },
});
const { selectAll } = adapter.getSelectors(s => s.contacts);`}
      liveDemo={
        <Provider store={ex.store}>
          <ErrorBoundary>
            <Demo />
          </ErrorBoundary>
        </Provider>
      }
      exerciseTitle="Migrate Array Slice to createEntityAdapter"
      exerciseContext={<>The contacts above use a <strong>plain array</strong> (watch the raw state). Migrate to <code>createEntityAdapter</code> — when done, the raw state should change from <code>{'{ items: [...] }'}</code> to <code>{'{ ids: [...], entities: {...} }'}</code>. The UI still works because <code>selectAllContacts</code> always returns an array.</>}
      exerciseSteps={[
        { text: 'Open exerciseSlice.ts — read the array-based slice', hint: 'src/lessons/07-entity-adapter/exerciseSlice.ts' },
        { text: 'Create an adapter: const adapter = createEntityAdapter<Contact>()', hint: 'Import createEntityAdapter from "@reduxjs/toolkit"' },
        { text: 'Replace initialState with adapter.getInitialState()', hint: '{ ids: [], entities: {} } shape' },
        { text: 'Replace reducer functions with adapter.addOne, removeOne, updateOne', hint: 'These replace your manual push/filter/map logic' },
        { text: 'Export selectors: const { selectAll: selectAllContacts } = adapter.getSelectors(s => s.contacts)', hint: 'Then check raw state — it should now show ids + entities!' },
      ]}
      exerciseFile="src/lessons/07-entity-adapter/exerciseSlice.ts"
      solution={`const adapter = createEntityAdapter<Contact>();

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: adapter.getInitialState(), // { ids: [], entities: {} }
  reducers: {
    addContact:    adapter.addOne,
    removeContact: adapter.removeOne,
    updateContact: adapter.updateOne,
  },
});

export const { selectAll: selectAllContacts }
  = adapter.getSelectors((s: RootState) => s.contacts);
export const { addContact, removeContact, updateContact } = contactsSlice.actions;`}
      onComplete={onComplete}
    />
  );
}
