import React from 'react';

interface State { error: Error | null; }
interface Props { children: React.ReactNode; }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.35)', borderLeft: '3px solid var(--error)', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span>🔴</span>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--error)' }}>Exercise Error — fix your code and save</h3>
          </div>
          <pre style={{ margin: 0, background: 'rgba(0,0,0,0.4)', borderRadius: '6px', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fca5a5', whiteSpace: 'pre-wrap', maxHeight: '160px', overflow: 'auto' }}>
            {error.name}: {error.message}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            className="btn-secondary"
            style={{ marginTop: '0.75rem', padding: '0.4rem 0.9rem', fontSize: '0.78rem', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            ↺ Reset Demo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
