// ══════════════════════════════════════════════════════════════
// LESSON 7 EXERCISE — createEntityAdapter
// ══════════════════════════════════════════════════════════════
// SCENARIO: A contacts slice uses a plain array. Arrays have
// O(n) lookup time. Rewrite it with createEntityAdapter for
// O(1) lookups and built-in CRUD operations.
// ══════════════════════════════════════════════════════════════

import { configureStore, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
// ❌ TODO: also import createEntityAdapter

interface Contact { id: number; name: string; email: string; phone?: string; }

// ══════════════════════════════════════════════════════════════
// ❌ CURRENT: plain array — slow O(n) lookups, manual CRUD
// ══════════════════════════════════════════════════════════════

const adapter = createEntityAdapter<Contact>()

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: adapter.getInitialState(),  // ← ❌ plain array
  reducers: {
    // ❌ Manual find-and-mutate (tedious, error-prone):
    addContact: adapter.addOne,
    removeContact: adapter.removeOne,
    updateContact: adapter.updateOne,
  },
});
interface StateType {
  contacts: Array<Contact>
}
// ❌ Manual selectors:
// export const selectAllContacts = adapter.getSelectors((s) => s?.contacts);

// export const selectContactById = (id: number) =>
//   (state: { contacts: ReturnType<typeof contactsSlice.reducer> }) =>
//     state.contacts.items.find(c => c.id === id); // ← still O(n)!


export const { addContact, removeContact, updateContact } = contactsSlice.actions;

export const store = configureStore({ reducer: { contacts: contactsSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;


export const {
  selectAll: selectAllContacts,
  selectById: selectContactById,

} = adapter.getSelectors((state: RootState) => state.contacts)


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
