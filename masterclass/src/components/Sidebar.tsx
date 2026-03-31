import React from 'react';
import { BookOpen, CheckCircle, Code, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const icons = [BookOpen, Layers, Code, Zap, CheckCircle];

interface SidebarProps {
  exercises: { id: string; title: string }[];
  activeIndex: number;
  onChange: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ exercises, activeIndex, onChange }) => {
  return (
    <>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Redux Masterclass
        </h1>
        <p style={{ fontSize: '0.9rem' }}>Module 1: Concepts & Data Flow</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {exercises.map((ex, idx) => {
          const Icon = icons[idx % icons.length];
          const isActive = activeIndex === idx;
          
          return (
            <button
              key={ex.id}
              onClick={() => onChange(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--primary-glow)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-2)',
                border: isActive ? '1px solid rgba(118, 74, 188, 0.5)' : '1px solid transparent',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <div style={{
                background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
              }}>
                <Icon size={18} />
              </div>
              <span style={{ fontWeight: isActive ? 600 : 400 }}>{ex.title}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: '4px',
                    height: '24px',
                    background: 'var(--secondary)',
                    borderRadius: '0 4px 4px 0'
                  }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
      
      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
          Progress: {Math.round((activeIndex / (exercises.length - 1)) * 100)}%
        </p>
        <div style={{ 
          height: '4px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '2px',
          marginTop: '0.5rem',
          overflow: 'hidden'
        }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(activeIndex / (exercises.length - 1)) * 100}%` }}
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
