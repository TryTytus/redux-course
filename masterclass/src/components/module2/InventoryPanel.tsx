import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/module2/hooks';
import {
  selectFilteredInventory,
  selectCategories,
  selectFilterCategory,
  setFilterCategory,
  applyDiscount,
} from '../../store/module2/inventorySlice';
import { addToCart, selectCartItems } from '../../store/module2/cartSlice';

export const InventoryPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector(selectFilteredInventory);
  const categories = useAppSelector(selectCategories);
  const activeFilter = useAppSelector(selectFilterCategory);
  const cartItems = useAppSelector(selectCartItems);
  const [discountPercent, setDiscountPercent] = useState(20);

  const isInCart = (id: number) => cartItems.some(i => i.id === id);

  return (
    <div className="glass-card" style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0 }}>🛍️ Store Inventory</h2>
        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--secondary)', background: 'rgba(0,216,255,0.1)', padding: '0.2rem 0.7rem', borderRadius: '999px' }}>
          {inventory.length} products
        </span>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          onClick={() => dispatch(setFilterCategory(null))}
          className={activeFilter === null ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => dispatch(setFilterCategory(cat))}
            className={activeFilter === cat ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {inventory.map(product => (
          <div
            key={product.id}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
              border: isInCart(product.id) ? '1px solid rgba(118,74,188,0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{product.name}</h4>
                {isInCart(product.id) && (
                  <span style={{ fontSize: '0.7rem', background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                    IN CART
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1rem' }}>
                  {product.price === 0 ? 'FREE' : `$${product.price.toFixed(2)}`}
                </span>
                <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                  {product.category}
                </span>
                <span style={{ color: product.stock < 5 ? 'var(--warning)' : 'var(--text-3)', fontSize: '0.8rem' }}>
                  {product.stock} left
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {/* Discount control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={e => setDiscountPercent(Number(e.target.value))}
                  min={1} max={99}
                  style={{
                    width: '50px', background: 'var(--surface-1)', border: '1px solid var(--glass-border)',
                    color: 'var(--text-1)', borderRadius: '6px', padding: '0.3rem 0.4rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>%</span>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
                onClick={() => dispatch(applyDiscount({ productId: product.id, percent: discountPercent }))}
              >
                Discount
              </button>
              <button
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                disabled={product.stock === 0}
                onClick={() => dispatch(addToCart({ product, addedAt: Date.now() }))}
              >
                {product.stock === 0 ? 'Out of Stock' : '+ Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
