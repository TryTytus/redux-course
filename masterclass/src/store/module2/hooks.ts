// Typed hooks — idiomatic RTK pattern
// Always use these instead of plain useDispatch/useSelector
// They provide correct TypeScript inference without manual type annotations

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * ✅ LESSON: Why typed hooks?
 * 
 * Without this:   const dispatch = useDispatch()          → dispatch is type 'Dispatch<AnyAction>'
 * With this:      const dispatch = useAppDispatch()       → dispatch knows about thunks, etc.
 *
 * Without this:   useSelector((state: RootState) => ...) → you must type state manually
 * With this:      useAppSelector(state => state.cart)    → state is auto-typed!
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
