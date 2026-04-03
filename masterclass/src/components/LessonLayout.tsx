import React, { useState } from 'react';

export interface Step { text: string; hint?: string; }

interface Props {
  lessonNumber: number;
  title: string;
  badge: 'Senior Essential' | 'Utility';
  // Concept
  whatIsIt: React.ReactNode;
  whenToUse: string[];
  howItWorks: string;       // raw code string shown in a <pre>
  liveDemo: React.ReactNode;
  // Exercise
  exerciseTitle: string;
  exerciseContext: React.ReactNode;
  exerciseSteps: Step[];
  exerciseFile: string;
  solution: string;         // raw code string shown collapsed
  onComplete?: () => void;
}

export function LessonLayout({
  lessonNumber, title, badge,
  whatIsIt, whenToUse, howItWorks, liveDemo,
  exerciseTitle, exerciseContext, exerciseSteps, exerciseFile, solution,
  onComplete,
}: Props) {
  const [showSolution, setShowSolution] = useState(false);
  const [done, setDone] = useState(false);

  const badgeColor = badge === 'Senior Essential' ? 'var(--primary)' : 'var(--warning)';

  const handleComplete = () => {
    setDone(true);
    onComplete?.();
  };

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Lesson header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
          {lessonNumber}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h1>
        </div>
        <span style={{ background: `${badgeColor}22`, border: `1px solid ${badgeColor}55`, color: badgeColor, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
          {badge}
        </span>
        <button
          className={done ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', opacity: done ? 0.6 : 1 }}
          onClick={handleComplete}
        >
          {done ? '✓ Completed' : 'Mark Complete'}
        </button>
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* LEFT — Concept */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ borderTop: '3px solid var(--secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📖</span>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary)' }}>Concept</h2>
            </div>

            <section style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '0.5rem' }}>What is it?</h3>
              <div style={{ color: 'var(--text-2)', lineHeight: 1.7, fontSize: '0.95rem' }}>{whatIsIt}</div>
            </section>

            <section style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '0.5rem' }}>When to use it</h3>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {whenToUse.map((item, i) => (
                  <li key={i} style={{ color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '0.5rem' }}>How it works</h3>
              <pre style={{ margin: 0, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.7, color: '#e2e8f0', whiteSpace: 'pre' }}>
                {howItWorks}
              </pre>
            </section>
          </div>

          {/* Live Demo */}
          <div className="glass-card" style={{ borderTop: '3px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🎮</span>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent)' }}>Live Demo</h2>
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>interact to learn</span>
            </div>
            {liveDemo}
          </div>
        </div>

        {/* RIGHT — Exercise */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ borderTop: '3px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>Exercise — {exerciseTitle}</h2>
            </div>

            <div style={{ color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{exerciseContext}</div>

            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '0.75rem' }}>Your Steps</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {exerciseSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <span style={{ width: '22px', height: '22px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-1)' }}>{step.text}</p>
                    {step.hint && <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>💡 {step.hint}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '0.6rem 1rem', background: 'rgba(118,74,188,0.08)', border: '1px solid rgba(118,74,188,0.25)', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-3)' }}>📁 File to edit:</p>
              <code style={{ fontSize: '0.82rem', color: 'var(--secondary)' }}>{exerciseFile}</code>
            </div>

            {/* Solution accordion */}
            <button
              onClick={() => setShowSolution(s => !s)}
              style={{ width: '100%', padding: '0.75rem', background: showSolution ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showSolution ? 'rgba(239,68,68,0.3)' : 'var(--glass-border)'}`, borderRadius: '8px', color: showSolution ? 'var(--error)' : 'var(--text-2)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              {showSolution ? '🙈 Hide Solution' : '👀 Show Solution (try first!)'}
            </button>
            {showSolution && (
              <pre style={{ margin: '0.75rem 0 0', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '1rem', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.7, color: '#e2e8f0', whiteSpace: 'pre' }}>
                {solution}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
