import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Intro = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card"
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        marginTop: '2rem',
        textAlign: 'center',
        padding: '4rem 2rem'
      }}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(118, 74, 188, 0.1)',
        marginBottom: '2rem'
      }}>
        <img src="https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo.png" alt="Redux Logo" style={{ width: '50px' }} />
      </div>
      
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }} className="text-gradient">
        Redux Masterclass
      </h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-2)', marginBottom: '2rem', fontWeight: 400 }}>
        Module 1: Concepts & Data Flow
      </h2>
      
      <p style={{ fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.8 }}>
        Welcome to the interactive Redux masterclass! In this module, you will not just read about Redux, but actively prove your understanding of its core principles. 
        Are you ready to master the one-way data flow, immutability, pure functions, and the single source of truth?
      </p>
      
      <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
        <Play size={20} /> Start Exercises
      </button>
    </motion.div>
  );
};

export default Intro;
