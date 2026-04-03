import React, { useEffect, useState } from 'react';
import { store, updateQuantity } from '../store';

export const Cart = () => {
  const [items, setItems] = useState(store.getState().cart.items);
  
  // ❌ EXERCISE: Single Source of Truth Violation!
  // The UI is unnecessarily replicating state. This total should be derived from the store data during render.
  // When discounts are applied, this total goes out of sync with the true value in the store.
  const [localCartTotal, setLocalCartTotal] = useState(0);

  useEffect(() => {
    // Initial calculation
    const initialTotal = store.getState().cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setLocalCartTotal(initialTotal);

    // Subscribe to updates
    return store.subscribe(() => {
      const state = store.getState();
      setItems(state.cart.items);
      
      // Attempting to keep local state synced, but applying discounts bypasses this sometimes
      const newTotal = state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setLocalCartTotal(newTotal);
    });
  }, []);

  return (
    <div className="glass-card" style={{ flex: 1, borderTop: '4px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Shopping Cart</h2>
        <span style={{ background: 'var(--primary-glow)', padding: '0.2rem 0.8rem', borderRadius: '1rem' }}>
          {items.length} items
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {items.length === 0 && <p style={{ color: 'var(--text-3)' }}>Your cart is empty.</p>}
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div>
              <h4 style={{ margin: 0 }}>{item.name}</h4>
              <p style={{ margin: 0, color: 'var(--text-2)', fontSize: '0.9rem' }}>${item.price.toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-1)', padding: '0.2rem', borderRadius: '8px' }}>
                <button style={{ padding: '0.2rem 0.6rem', color: 'white' }} onClick={() => store.dispatch(updateQuantity(item.id, -1))}>-</button>
                <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button style={{ padding: '0.2rem 0.6rem', color: 'white' }} onClick={() => store.dispatch(updateQuantity(item.id, 1))}>+</button>
              </div>
              <strong style={{ minWidth: '60px', textAlign: 'right' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Total</h3>
          <h2 className="text-gradient">${localCartTotal.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};
