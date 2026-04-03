// ══════════════════════════════════════════════════════════════
// LESSON 7 EXERCISE — createEntityAdapter
// ══════════════════════════════════════════════════════════════
// SCENARIO: A contacts slice uses a plain array. Arrays have
// O(n) lookup time. Rewrite it with createEntityAdapter for
// O(1) lookups and built-in CRUD operations.
// ══════════════════════════════════════════════════════════════

import { configureStore, createSlice } from '@reduxjs/toolkit';
// ❌ TODO: also import createEntityAdapter

interface Contact { id: number; name: string; email: string; phone?: string; }

// ══════════════════════════════════════════════════════════════
// ❌ CURRENT: plain array — slow O(n) lookups, manual CRUD
// ══════════════════════════════════════════════════════════════

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: { items: [] as Contact[] },  // ← ❌ plain array
  reducers: {
    // ❌ Manual find-and-mutate (tedious, error-prone):
    addContact: (state, action: { payload: Contact }) => {
      state.items.push(action.payload);
    },
    removeContact: (state, action: { payload: number }) => {
      state.items = state.items.filter(c => c.id !== action.payload); // ← O(n)!
    },
    updateContact: (state, action: { payload: { id: number; changes: Partial<Contact> } }) => {
      const contact = state.items.find(c => c.id === action.payload.id); // ← O(n)!
      if (contact) Object.assign(contact, action.payload.changes);
    },
  },
});

// ❌ Manual selectors:
export const selectAllContacts = (state: { contacts: ReturnType<typeof contactsSlice.reducer> }) =>
  state.contacts.items;

export const selectContactById = (id: number) =>
  (state: { contacts: ReturnType<typeof contactsSlice.reducer> }) =>
    state.contacts.items.find(c => c.id === id); // ← still O(n)!

export const { addContact, removeContact, updateContact } = contactsSlice.actions;

export const store = configureStore({ reducer: { contacts: contactsSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;

// ══════════════════════════════════════════════════════════════
// YOUR TASK:
// 1. Create an adapter: const adapter = createEntityAdapter<Contact>()
// 2. Replace initialState with adapter.getInitialState()
//    Shape becomes: { ids: number[], entities: { [id]: Contact } }
// 3. Replace reducers with adapter.addOne, removeOne, updateOne
// 4. Export selectors from adapter.getSelectors()
// ══════════════════════════════════════════════════════════════
// ✅ DONE WHEN: state.contacts looks like { ids: [...], entities: {...} }
//   and selectAllContacts still returns a Contact[] array
