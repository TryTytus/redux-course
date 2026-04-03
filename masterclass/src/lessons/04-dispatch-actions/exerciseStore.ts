    // ══════════════════════════════════════════════════════════════
// LESSON 4 EXERCISE — dispatch + Actions
// ══════════════════════════════════════════════════════════════
// SCENARIO: A developer built a todo app that calls the reducer
// function DIRECTLY. This bypasses the store — no re-renders,
// no DevTools, no middleware. Fix it to use dispatch().
// ══════════════════════════════════════════════════════════════

import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Todo { id: number; text: string; done: boolean; }

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [] as Todo[] },
  reducers: {
    addTodo:    (s, a: PayloadAction<string>) => { s.items.push({ id: Date.now(), text: a.payload, done: false }); },
    toggleTodo: (s, a: PayloadAction<number>) => { const t = s.items.find(t => t.id === a.payload); if (t) t.done = !t.done; },
    removeTodo: (s, a: PayloadAction<number>) => { s.items = s.items.filter(t => t.id !== a.payload); },
  },
});

export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;
export const store = configureStore({ reducer: { todos: todosSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;

// ══════════════════════════════════════════════════════════════
// ❌ BROKEN CODE BELOW — The component calls reducer directly!
// ══════════════════════════════════════════════════════════════

// Imagine this in a React component:
//
// const handleAdd = (text: string) => {
//   // ❌ THIS IS WRONG! Never call reducer directly:
//   todosSlice.reducer(store.getState().todos, addTodo(text));
//   // Nothing happens — store state didn't change!
// };
//
// const handleToggle = (id: number) => {
//   // ❌ ALSO WRONG:
//   todosSlice.reducer(store.getState().todos, toggleTodo(id));
// };
//
// ══════════════════════════════════════════════════════════════
// YOUR TASK: Rewrite these handlers using:
//   store.dispatch(addTodo(text))
//   store.dispatch(toggleTodo(id))
//   store.dispatch(removeTodo(id))
//
// Or inside a React component:
//   const dispatch = useDispatch();
//   dispatch(addTodo(text));
// ══════════════════════════════════════════════════════════════
// ✅ DONE WHEN: Actions appear in Redux DevTools action log
