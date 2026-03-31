import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const FUNCTIONS = [
  { id: 1, name: 'add(a, b)', code: 'return a + b;', pure: true, explanation: 'Always returns the same output for same inputs, no side effects.' },
  { id: 2, name: 'toggleTodo(todo)', code: 'todo.completed = !todo.completed;\\nreturn todo;', pure: false, explanation: 'Mutates the input argument! A pure function should return a copy.' },
  { id: 3, name: 'getRandomId()', code: 'return Math.random().toString(36);', pure: false, explanation: 'Output is unpredictable (depends on Math.random).' },
  { id: 4, name: 'formatDate(date)', code: 'return new Intl.DateTimeFormat().format(date);', pure: true, explanation: 'Given the same date string/object, it returns the same formatted string. No side effects.' },
  { id: 5, name: 'fetchUser(id)', code: 'const res = await api.get(`/users/${id}`);\\nreturn res.data;', pure: false, explanation: 'Performs an API call (Network IO), which is a side effect.' },
  { id: 6, name: 'incrementCount(state)', code: 'return { ...state, count: state.count + 1 };', pure: true, explanation: 'Does not mutate state, uses only its input, no side effects.' }
];

const PureFunctions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({}); // id -> isCorrect
  const [showFeedback, setShowFeedback] = useState(false);
  
  const currentFn = FUNCTIONS[currentIndex];
  const isComplete = currentIndex >= FUNCTIONS.length;

  const handleAnswer = (guessedPure: boolean) => {
    const isCorrect = guessedPure === currentFn.pure;
    setAnswers(prev => ({ ...prev, [currentFn.id]: isCorrect }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setCurrentIndex(prev => prev + 1);
  };

  const score = Object.values(answers).filter(Boolean).length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        3. Pure Function Sorter
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
        Redux reducers <strong>must be pure functions</strong>. A pure function has two rules: 
        1) Same input always gives same output. 2) No side effects. 
        <br/><br/>
        Analyze the function below. Is it pure or impure?
      </p>

      {!isComplete ? (
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-3)' }}>
            Function {currentIndex + 1} of {FUNCTIONS.length}
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
              {currentFn.name}
            </h3>
            <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <code style={{ fontSize: '1.1rem', color: '#e2e8f0', background: 'transparent' }}>
                {currentFn.code.split('\\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </code>
            </pre>
          </div>

          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.div 
                key="buttons"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', gap: '1rem' }}
              >
                <button 
                  onClick={() => handleAnswer(true)}
                  style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', fontSize: '1.2rem' }}
                >
                  Pure
                </button>
                <button 
                  onClick={() => handleAnswer(false)}
                  style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', fontSize: '1.2rem' }}
                >
                  Impure
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="feedback"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  background: answers[currentFn.id] ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${answers[currentFn.id] ? 'var(--success)' : 'var(--error)'}`,
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: answers[currentFn.id] ? 'var(--success)' : 'var(--error)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {answers[currentFn.id] ? <Check /> : <X />} 
                  {answers[currentFn.id] ? 'Correct!' : 'Incorrect!'} 
                  ({currentFn.pure ? 'It is a Pure Function' : 'It is Impure'})
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-1)' }}>
                  {currentFn.explanation}
                </p>
                <button className="btn-primary" onClick={handleNext}>
                  Next Function
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Score: {score} / {FUNCTIONS.length}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-2)', marginBottom: '2rem' }}>
            {score === FUNCTIONS.length ? "Flawless! You perfectly understand pure functions." : "Good effort! Remember: pure functions are predictable and side-effect free."}
          </p>
          <div style={{ display: 'inline-flex', padding: '1rem 2rem', background: 'var(--primary-glow)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)' }}>
            "A reducer is just a pure function that takes the previous state and an action, and returns the next state."
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PureFunctions;
