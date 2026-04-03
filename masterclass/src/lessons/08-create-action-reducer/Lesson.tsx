import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import * as ex from './exerciseReducer'; // ← YOUR exercise file

function Demo() {
  const current  = useSelector((s: any) => s?.theme?.current ?? '—');
  const previous = useSelector((s: any) => s?.theme?.previous ?? null);
  const dispatch  = useDispatch();

  const THEMES = ['dark', 'light', 'solarized', 'dracula', 'nord'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ padding: '1rem', background: current === 'dark' ? 'rgba(0,0,0,0.5)' : current === 'light' ? 'rgba(255,255,255,0.1)' : 'rgba(118,74,188,0.15)', border: '1px solid var(--glass-border)', borderRadius: '8px', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.2rem' }}>Current theme</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--secondary)' }}>{current}</div>
          </div>
          {previous && <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>← was: {previous}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {THEMES.map(t => (
          <button key={t} className={current === t ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
            onClick={() => dispatch(ex.setTheme(t) as any)}>
            {t}
          </button>
        ))}
        <button className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', color: 'var(--error)', marginLeft: 'auto' }}
          onClick={() => dispatch(ex.resetTheme() as any)}>
          Reset
        </button>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>Action produced by setTheme()</div>
        <code style={{ fontSize: '0.8rem', color: 'var(--success)', background: 'none' }}>
          {JSON.stringify(ex.setTheme('light'))}
        </code>
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 After migrating to <code>createAction</code>, the action object shown above should have proper TypeScript types on the payload.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={8} title="createAction + createReducer" badge="Utility"
      whatIsIt={<><code>createAction(type)</code> creates a typed action creator. <code>createReducer(initialState, builder)</code> uses a <strong>builder pattern</strong> (type-safe <code>addCase</code>) instead of <code>switch/case</code>. These are the lower-level primitives that <code>createSlice</code> uses internally.</>}
      whenToUse={[
        'Migrating an existing vanilla reducer to RTK without a full rewrite',
        'When you need addMatcher (handle multiple action types with one handler)',
        'When fine-grained control over reducer build is needed',
        'Usually prefer createSlice — but these fundamentals matter when reading RTK source',
      ]}
      howItWorks={`const setTheme   = createAction<string>('theme/setTheme');
const resetTheme = createAction('theme/reset');

const themeReducer = createReducer(initialState, builder => {
  builder
    .addCase(setTheme, (state, action) => {
      // action.payload is typed as string — no casting!
      state.previous = state.current;
      state.current  = action.payload;
    })
    .addCase(resetTheme, state => {
      state.current  = 'dark';
      state.previous = null;
    });
});`}
      liveDemo={
        <Provider store={ex.store}>
          <ErrorBoundary>
            <Demo />
          </ErrorBoundary>
        </Provider>
      }
      exerciseTitle="Migrate switch/case to Builder Pattern"
      exerciseContext={<>The theme switcher above runs your <code>exerciseReducer.ts</code>. It works with the old switch/case reducer. Migrate it to <code>createAction</code> + <code>createReducer</code> — same behavior, better TypeScript. Watch the action box at the bottom — after migration it should show a cleaner action object.</>}
      exerciseSteps={[
        { text: 'Open exerciseReducer.ts — read the switch/case reducer', hint: 'src/lessons/08-create-action-reducer/exerciseReducer.ts' },
        { text: 'Replace manual action creators with createAction:', hint: 'const setTheme = createAction<string>("theme/setTheme")' },
        { text: 'Replace the switch/case reducer with createReducer + builder.addCase()', hint: 'See howItWorks code above — exact pattern to follow' },
        { text: 'Verify: setTheme("light") should now produce a typed action automatically', hint: 'TypeScript will infer payload as string — no manual type annotation!' },
      ]}
      exerciseFile="src/lessons/08-create-action-reducer/exerciseReducer.ts"
      solution={`import { createAction, createReducer } from '@reduxjs/toolkit';

const setTheme   = createAction<string>('theme/setTheme');
const resetTheme = createAction('theme/reset');

const themeReducer = createReducer(initialState, builder => {
  builder
    .addCase(setTheme, (state, action) => {
      state.previous = state.current;
      state.current  = action.payload; // ← TypeScript knows this is string!
    })
    .addCase(resetTheme, state => {
      state.current  = 'dark';
      state.previous = null;
    });
});`}
      onComplete={onComplete}
    />
  );
}
