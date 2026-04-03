import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/module2/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTotal,
  selectCartItemCount,
  selectCouponError,
  selectAppliedCouponCode,
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '../../store/module2/cartSlice';

export const CartPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscount);
  const total = useAppSelector(selectCartTotal);
  const couponError = useAppSelector(selectCouponError);
  const appliedCoupon = useAppSelector(selectAppliedCouponCode);

  const [couponInput, setCouponInput] = useState('');

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(applyCoupon(couponInput));
    setCouponInput('');
  };

  return (
    <div className="glass-card" style={{ flex: 1, borderTop: '3px solid var(--primary)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0 }}>🛒 Cart</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
            {itemCount}
          </span>
          {items.length > 0 && (
            <button
              className="btn-secondary"
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.3)' }}
              onClick={() => dispatch(clearCart())}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '80px' }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
            <p>Your cart is empty.</p>
            <p style={{ fontSize: '0.8rem' }}>Add some products from the inventory!</p>
          </div>
        )}
        {items.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)',
              borderRadius: '10px', transition: 'all 0.2s',
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-1)', fontWeight: 500 }}>{item.name}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-3)' }}>
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
            </div>

            {/* Quantity control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-1)', padding: '0.25rem', borderRadius: '8px' }}>
              <button
                style={{ width: '26px', height: '26px', color: 'white', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
                onClick={() => dispatch(updateQuantity({ id: item.id, delta: -1 }))}
              >-</button>
              <span style={{ minWidth: '20px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.quantity}</span>
              <button
                style={{ width: '26px', height: '26px', color: 'white', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
                onClick={() => dispatch(updateQuantity({ id: item.id, delta: 1 }))}
              >+</button>
            </div>

            <strong style={{ minWidth: '60px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </strong>

            <button
              style={{ color: 'var(--text-3)', fontSize: '1rem', padding: '0.2rem 0.4rem', borderRadius: '4px' }}
              onClick={() => dispatch(removeFromCart(item.id))}
              title="Remove item"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Coupon section */}
      {items.length > 0 && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          {appliedCoupon ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '0.6rem 1rem' }}>
              <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>
                ✓ Coupon <strong>{appliedCoupon}</strong> applied!
              </span>
              <button
                style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}
                onClick={() => dispatch(removeCoupon())}
              >Remove</button>
            </div>
          ) : (
            <form onSubmit={handleCouponSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
                placeholder="Coupon code..."
                style={{
                  flex: 1, background: 'var(--surface-1)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-1)', borderRadius: '8px', padding: '0.5rem 0.75rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none',
                }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Apply
              </button>
            </form>
          )}
          {couponError && (
            <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.5rem', margin: '0.4rem 0 0' }}>
              ⚠ {couponError}
            </p>
          )}
        </div>
      )}

      {/* Totals */}
      {items.length > 0 && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-2)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              <span>Discount ({appliedCoupon})</span>
              <span>−${discount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Total</h3>
            <h2 className="text-gradient" style={{ margin: 0 }}>${total.toFixed(2)}</h2>
          </div>
        </div>
      )}
    </div>
  );
};
