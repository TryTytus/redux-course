// ══════════════════════════════════════════════════════════════
// LESSON 3 EXERCISE — NotificationBell Component (BROKEN)
// ══════════════════════════════════════════════════════════════
// This component has hardcoded data and local state.
// Your task: wire it up with useSelector + useDispatch.
// ══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { store, markAllRead, addNotification, type RootState } from './exerciseStore'

// ❌ TODO: import useSelector and useDispatch from 'react-redux'
// ❌ TODO: import markAllRead, addNotification from './exerciseStore'
// ❌ TODO: import RootState from './exerciseStore'

export function NotificationBell() {
  // ❌ PROBLEM: This is hardcoded — it should come from the store!
  // const unreadCount = 2;
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount)
  const dispatch = useDispatch()

  // ❌ PROBLEM: This is local state — real data comes from the store
  // const [items] = useState([
  //   { id: 1, message: '🎉 Welcome to Redux Masterclass!', read: false },
  //   { id: 2, message: '📦 New lesson available: createSlice', read: false },
  // ]);

  const items = useSelector((state: RootState) => state.notifications.items)

  const handleMarkRead = () => {
    // ❌ PROBLEM: This does nothing! Should dispatch markAllRead()
    dispatch(markAllRead())
    console.log('TODO: dispatch markAllRead()');
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span>🔔 Notifications ({unreadCount} unread)</span>
        <button onClick={handleMarkRead} style={{ fontSize: '0.75rem' }}>Mark all read</button>
      </div>
      {items.map(n => (
        <div key={n.id} style={{ padding: '0.4rem', opacity: n.read ? 0.5 : 1, fontSize: '0.85rem' }}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
