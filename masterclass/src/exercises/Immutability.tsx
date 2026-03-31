import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const SNIPPETS = [
  { id: 1, code: "state.user.name = 'John';", safe: false, reason: "Direct mutation of nested property." },
  { id: 2, code: "return {\\n  ...state,\\n  user: { ...state.user, name: 'John' }\\n};", safe: true, reason: "Creates new copies of state and nested user object." },
  { id: 3, code: "state.todos.push(newTodo);", safe: false, reason: ".push() mutates the original array." },
  { id: 4, code: "return {\\n  ...state,\\n  todos: [...state.todos, newTodo]\\n};", safe: true, reason: "Spread operator creates a new array." },
  { id: 5, code: "const newState = state;\\nnewState.count++;\\nreturn newState;", safe: false, reason: "Assignment copies reference, not the value. It still mutates." },
  { id: 6, code: "return state.map(item =>\\n  item.id === 1 ? { ...item, done: true } : item\\n);", safe: true, reason: ".map() returns a new array, and spread creates new objects for changes." }
];

const Immutability = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleReveal = (id: number) => {
    setRevealed(prev => ({ ...prev, [id]: true }));
  };

  const allRevealed = Object.keys(revealed).length === SNIPPETS.length;
  const correctCount = Object.keys(revealed).reduce((acc, id) => {
    const snippet = SNIPPETS.find(s => s.id === Number(id));
    return acc + (snippet?.safe ? 1 : 0);
  }, 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        2. The Immutability Challenge
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '700px' }}>
        Redux requires that state is never modified directly. Instead, you must return new object references. 
        Click on each snippet below to determine if it is a <strong>Safe (Immutable)</strong> update or a <strong>Mutating</strong> update.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {SNIPPETS.map(snippet => {
          const isRevealed = revealed[snippet.id];
          
          return (
            <motion.div
              key={snippet.id}
              onClick={() => !isRevealed && handleReveal(snippet.id)}
              whileHover={!isRevealed ? { y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' } : {}}
              style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: `1px solid ${isRevealed ? (snippet.safe ? 'var(--success)' : 'var(--error)') : 'var(--glass-border)'}`,
                cursor: isRevealed ? 'default' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <pre style={{ margin: 0, padding: 0, background: 'none', flex: 1 }}>
                <code style={{ background: 'transparent', padding: 0, color: '#e2e8f0', display: 'block' }}>
                  {snippet.code.split('\\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </code>
              </pre>

              {isRevealed && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    color: snippet.safe ? 'var(--success)' : 'var(--error)'
                  }}
                >
                  <div style={{ marginTop: '2px' }}>
                    {snippet.safe ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                  </div>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
                      {snippet.safe ? 'Safe Immutable Update' : 'Mutates State!'}
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-2)' }}>
                      {snippet.reason}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {allRevealed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{ textAlign: 'center', borderColor: 'var(--primary)' }}
        >
          <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1rem' }}>Great job!</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Remember: whenever you update a nested object or array in vanilla Redux, you must copy 
            <em> every level of nesting </em> that is being updated. 
            (Note: In Redux Toolkit, <code>createSlice</code> uses Immer to let you write mutating logic safely!)
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Immutability;
