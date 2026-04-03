import React, { useEffect, useState } from 'react';
import { store, addToCart, applyDiscount } from '../store';

export const ProductList = () => {
  // Syncing with vanilla store
  const [inventory, setInventory] = useState(store.getState().inventory);

  useEffect(() => {
    return store.subscribe(() => {
      setInventory(store.getState().inventory);
    });
  }, []);

  const handleDirectDiscount = (id: number) => {
    // ❌ EXERCISE: One-Way Data Flow Violation!
    // This UI component is updating state directly. In Redux, UI only *dispatches actions*.
    // Fix this to dispatch an applyDiscount action instead!
    
    console.warn("Direct mutation detected! This breaks the flow.");
    const mutableState = store._dangerousGetMutableState();
    const product = mutableState.inventory.find(p => p.id === id);
    if (product) {
      product.price = product.price * 0.8; // 20% off
    }
    
    // Manual re-render to "hack" it into working
    setInventory([...mutableState.inventory]); 
  };

  return (
    <div className="glass-card" style={{ flex: 1 }}>
      <h2>Store Inventory</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {inventory.map(product => (
          <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div>
              <h3 style={{ margin: 0 }}>{product.name}</h3>
              <p style={{ margin: 0, color: 'var(--success)', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={() => handleDirectDiscount(product.id)}>
                Apply 20% Discount
              </button>
              <button className="btn-primary" onClick={() => store.dispatch(addToCart(product.id))}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
