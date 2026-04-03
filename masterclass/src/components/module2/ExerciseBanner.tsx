import React from 'react';

interface ConceptCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  color?: string;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ icon, title, children, color = 'var(--primary)' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${color}33`,
    borderLeft: `3px solid ${color}`,
    borderRadius: '10px',
    padding: '1rem 1.25rem',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <strong style={{ color, fontSize: '0.95rem' }}>{title}</strong>
    </div>
    <div style={{ color: 'var(--text-2)', fontSize: '0.85rem', lineHeight: 1.6 }}>{children}</div>
  </div>
);

export const ExerciseBanner: React.FC = () => {
  return (
    <div className="glass-card" style={{ borderColor: 'var(--primary)', borderTopWidth: '3px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem' }}>⚡</div>
        <div>
          <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.6rem' }}>
            Module 2: Redux Toolkit
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            createSlice · Immer · configureStore · createSelector · Typed Hooks
          </p>
        </div>
        <div style={{
          marginLeft: 'auto', background: 'var(--primary-glow)', border: '1px solid rgba(118,74,188,0.5)',
          borderRadius: '8px', padding: '0.5rem 1rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>COUPONS TO TRY</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <code style={{ background: 'none', color: 'var(--secondary)' }}>REDUX10</code>
            <code style={{ background: 'none', color: 'var(--secondary)' }}>RTK20</code>
            <code style={{ background: 'none', color: 'var(--secondary)' }}>IMMER50</code>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
        <ConceptCard icon="🔪" title="createSlice" color="var(--primary)">
          Groups <code>name</code>, <code>initialState</code>, and <code>reducers</code> in one place.
          Auto-generates action creators so you never write them manually.
        </ConceptCard>

        <ConceptCard icon="🧊" title="Immer (built into RTK)" color="var(--secondary)">
          Inside a slice reducer you <strong>can</strong> write mutating code.
          Immer converts it to a safe immutable update behind the scenes.
        </ConceptCard>

        <ConceptCard icon="🏗️" title="configureStore" color="#f59e0b">
          Replaces createStore. Adds thunk, DevTools, and Immer automatically.
          Just pass your slice reducers — it handles the rest.
        </ConceptCard>

        <ConceptCard icon="🎯" title="createSelector" color="var(--success)">
          Memoizes derived state. Only recomputes when its <em>input selectors</em> change.
          Prevents unnecessary re-renders in big apps.
        </ConceptCard>

        <ConceptCard icon="🪝" title="Typed Hooks" color="var(--accent)">
          <code>useAppSelector</code> and <code>useAppDispatch</code> add TypeScript inference.
          No more manually typing <code>(state: RootState)</code> everywhere.
        </ConceptCard>

        <ConceptCard icon="📋" title="Your Exercises" color="var(--error)">
          Open <code>src/store/module2/inventorySlice.ts</code> and <code>cartSlice.ts</code>.
          Find every <code>❌ EXERCISE</code> comment and complete the challenge.
        </ConceptCard>
      </div>
    </div>
  );
};
