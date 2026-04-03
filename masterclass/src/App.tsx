import React, { useState, useEffect } from 'react';
import './index.css';
import { Lesson as L01 } from './lessons/01-configure-store/Lesson';
import { Lesson as L02 } from './lessons/02-create-slice/Lesson';
import { Lesson as L03 } from './lessons/03-use-selector-dispatch/Lesson';
import { Lesson as L04 } from './lessons/04-dispatch-actions/Lesson';
import { Lesson as L05 } from './lessons/05-create-selector/Lesson';
import { Lesson as L06 } from './lessons/06-get-state/Lesson';
import { Lesson as L07 } from './lessons/07-entity-adapter/Lesson';
import { Lesson as L08 } from './lessons/08-create-action-reducer/Lesson';
import { Lesson as L09 } from './lessons/09-combine-reducers/Lesson';
import { Lesson as L10 } from './lessons/10-shallow-equal/Lesson';

const LESSONS = [
  { id: 1,  icon: '⚙️',  title: 'configureStore + Provider',     badge: 'Senior Essential', Comp: L01 },
  { id: 2,  icon: '🔪',  title: 'createSlice + Immer',           badge: 'Senior Essential', Comp: L02 },
  { id: 3,  icon: '👁️',  title: 'useSelector + useDispatch',     badge: 'Senior Essential', Comp: L03 },
  { id: 4,  icon: '🎯',  title: 'dispatch + Actions',            badge: 'Senior Essential', Comp: L04 },
  { id: 5,  icon: '⚡',  title: 'createSelector',                badge: 'Senior Essential', Comp: L05 },
  { id: 6,  icon: '🔭',  title: 'getState',                      badge: 'Senior Essential', Comp: L06 },
  { id: 7,  icon: '📚',  title: 'createEntityAdapter',           badge: 'Senior Essential', Comp: L07 },
  { id: 8,  icon: '🏗️',  title: 'createAction + createReducer',  badge: 'Utility',          Comp: L08 },
  { id: 9,  icon: '🌳',  title: 'combineReducers',               badge: 'Utility',          Comp: L09 },
  { id: 10, icon: '🛡️',  title: 'shallowEqual + useStore',       badge: 'Utility',          Comp: L10 },
] as const;

export default function App() {
  const [active, setActive] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('rtk-done') || '[]')); }
    catch { return new Set(); }
  });

  const markComplete = (id: number) => {
    setCompleted(prev => {
      const next = new Set(prev).add(id);
      localStorage.setItem('rtk-done', JSON.stringify([...next]));
      return next;
    });
  };

  const ActiveLesson = LESSONS[active - 1].Comp;
  const progress = Math.round((completed.size / LESSONS.length) * 100);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '272px', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '1.2rem', margin: 0 }}>Redux Masterclass</h1>
          <p style={{ fontSize: '0.78rem', margin: '0.25rem 0 0', color: 'var(--text-3)' }}>10 concepts · learn by doing</p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Progress</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{progress}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Lesson list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {LESSONS.map(l => (
            <button
              key={l.id}
              className={`sidebar-item${active === l.id ? ' active' : ''}`}
              onClick={() => setActive(l.id)}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{l.icon}</span>
              <span style={{ flex: 1, lineHeight: 1.3 }}>{l.title}</span>
              {completed.has(l.id) && <span style={{ color: 'var(--success)', fontSize: '0.9rem', flexShrink: 0 }}>✓</span>}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-3)' }}
            onClick={() => { localStorage.removeItem('rtk-done'); setCompleted(new Set()); }}
          >
            Reset Progress
          </button>
        </div>
      </aside>

      {/* Main scrollable content */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-color)' }}>
        <ActiveLesson key={active} onComplete={() => markComplete(active)} />
      </main>
    </div>
  );
}
