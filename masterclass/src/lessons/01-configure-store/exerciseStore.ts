// ══════════════════════════════════════════════════════════════
// LESSON 1 EXERCISE — configureStore + Provider
// ══════════════════════════════════════════════════════════════
// SCENARIO: You inherit an old Redux app that uses the deprecated
// createStore API. Your job: migrate it to RTK's configureStore.
//
// ❌ CURRENT (broken / deprecated):
// ══════════════════════════════════════════════════════════════

// import { createStore } from 'redux'; // ← ❌ deprecated!
import { configureStore } from '@reduxjs/toolkit';

interface CounterState { count: number; }

function counterReducer(
  state: CounterState = { count: 0 },
  action: { type: string }
): CounterState {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    default:          return state;
  }
}
const preloadedState: CounterState = {
    count: 0
  }

export const store = configureStore({
  reducer: {
    counterReducer: (state: CounterState = preloadedState, action: { type: string }) => {
      let newCount = state.count;
      if (action.type === "INCREMENT") 
        newCount += 1
      else if (action.type === "DECREMENT")
        newCount -= 1
      return { count: newCount }
    }
  }
})




// ❌ createStore is deprecated — no DevTools, no Immer, no thunk by default
// export const store = createStore(counterReducer);

// ══════════════════════════════════════════════════════════════
// YOUR TASKS:
// 1. Replace the import: use configureStore from '@reduxjs/toolkit'
// 2. Replace createStore(counterReducer) with:
//    configureStore({ reducer: counterReducer })
// 3. Add the RootState and AppDispatch type exports (see solution)
// ══════════════════════════════════════════════════════════════
// ✅ DONE WHEN: Redux DevTools shows "@@INIT" action on page load
